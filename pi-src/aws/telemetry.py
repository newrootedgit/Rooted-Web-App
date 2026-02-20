#!/usr/bin/env python3
"""
Telemetry Uplink

Periodically drains unsynced rows from the local SQLite telemetry DB
and publishes them to AWS IoT Core over MQTT.

Topic:   rooted/machines/<device_id>/telemetry
Payload: { "session_id": str, "uptime_s": int, "delta_steps": int }
"""

import json
import sqlite3
import time

from awscrt.mqtt import QoS
from aws_iot_registration import connect_to_aws_iot, disconnect_from_aws_iot, get_device_config

DB_FILE_PATH = "/home/rooted/te-cli/harvester_telemetry.db"

POLL_INTERVAL_S = 300  # seconds between drain attempts (5 minutes)
BATCH_SIZE      = 50  # max rows published per cycle


def open_db(path: str) -> sqlite3.Connection:
    conn = sqlite3.connect(path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def fetch_unsynced(db: sqlite3.Connection, limit: int) -> list[sqlite3.Row]:
    try:
        return db.execute(
            "SELECT id, session_id, uptime_s, delta_steps FROM telemetry_log"
            " WHERE synced = 0 ORDER BY id ASC LIMIT ?",
            (limit,),
        ).fetchall()
    except sqlite3.OperationalError:
        print("[telemetry] telemetry_log table not found — harvester not yet running.")
        return []


def mark_synced(db: sqlite3.Connection, row_ids: list[int]) -> None:
    db.execute(
        f"UPDATE telemetry_log SET synced = 1 WHERE id IN ({','.join('?' * len(row_ids))})",
        row_ids,
    )
    db.commit()


def publish_batch(
    mqtt_connection,
    topic: str,
    rows: list[sqlite3.Row],
) -> list[int]:
    """
    Publish each row and collect the IDs that were successfully handed to
    the broker (QoS 1 puback received).  Returns the list of synced IDs.
    """
    synced_ids: list[int] = []

    for row in rows:
        payload = json.dumps({
            "session_id":  row["session_id"],
            "uptime_s":    row["uptime_s"],
            "delta_steps": row["delta_steps"],
        })
        try:
            pub_future, _ = mqtt_connection.publish(
                topic=topic,
                payload=payload,
                qos=QoS.AT_LEAST_ONCE,
            )
            pub_future.result()  # blocks until puback
            synced_ids.append(row["id"])
            print(
                f"[telemetry] ↑ id={row['id']}  "
                f"uptime={row['uptime_s']:>6}s  "
                f"delta={row['delta_steps']:>6} steps  [sent]"
            )
        except Exception as e:
            print(f"[telemetry] Publish failed for row id={row['id']}: {e}")
            # Stop this batch; rows from here on will be retried next cycle.
            break

    return synced_ids


def run_uplink() -> None:
    config    = get_device_config()
    device_id = config["device_id"]
    topic     = f"rooted/machines/{device_id}/telemetry"

    print(f"[telemetry] Device: {device_id}")
    print(f"[telemetry] Topic:  {topic}")
    print(f"[telemetry] DB:     {DB_FILE_PATH}")

    db             = open_db(DB_FILE_PATH)
    mqtt_connection = connect_to_aws_iot()

    print(f"[telemetry] Draining every {POLL_INTERVAL_S}s, batch={BATCH_SIZE} rows.")

    try:
        while True:
            rows = fetch_unsynced(db, BATCH_SIZE)

            if rows:
                synced_ids = publish_batch(mqtt_connection, topic, rows)
                if synced_ids:
                    mark_synced(db, synced_ids)
                    print(f"[telemetry] Marked {len(synced_ids)} row(s) synced.")
            else:
                print("[telemetry] No unsynced rows.")

            time.sleep(POLL_INTERVAL_S)

    except KeyboardInterrupt:
        print("\n[telemetry] Shutting down...")
    finally:
        db.close()
        disconnect_from_aws_iot(mqtt_connection)


if __name__ == "__main__":
    run_uplink()
