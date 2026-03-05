#!/usr/bin/env python3
"""
Telemetry Uplink

Periodically drains unsynced records from the local JSONL telemetry log
and publishes them to AWS IoT Core over MQTT.

Topic:   rooted/machines/<device_id>/telemetry
Payload: each JSONL record forwarded as-is

Can be used standalone or imported and threaded into another process
via start_telemetry_thread().
"""

import json
import os
import tempfile
import threading
import time

from awscrt.mqtt import QoS
from aws_iot_registration import connect_to_aws_iot, disconnect_from_aws_iot, get_device_config

LOG_JSONL_PATH  = "/home/rooted/telemetry_log.jsonl"
CURSOR_PATH     = "/home/rooted/telemetry_cursor.json"

POLL_INTERVAL_S = 300  # seconds between drain attempts (5 minutes)
BATCH_SIZE      = 50   # max records published per cycle


def read_cursor() -> int:
    """Return the number of lines already synced (0 if cursor is missing or corrupt)."""
    try:
        with open(CURSOR_PATH, "r") as f:
            data = json.load(f)
        return int(data["synced_lines"])
    except Exception:
        return 0


def write_cursor(n: int) -> None:
    """Atomically update the cursor file to n synced lines."""
    dir_ = os.path.dirname(CURSOR_PATH)
    with tempfile.NamedTemporaryFile("w", dir=dir_, delete=False, suffix=".tmp") as tmp:
        json.dump({"synced_lines": n}, tmp)
        tmp_path = tmp.name
    os.replace(tmp_path, CURSOR_PATH)


def fetch_unsynced_jsonl(cursor: int) -> list[dict]:
    """
    Read lines [cursor:] from the JSONL file, up to BATCH_SIZE.

    Concurrency guards:
    - Discards the final line if it has no trailing newline (mid-write in progress).
    - Skips lines that are not valid JSON.
    """
    try:
        with open(LOG_JSONL_PATH, "r") as f:
            content = f.read()
    except FileNotFoundError:
        return []

    # Drop last line if mid-write (no trailing newline)
    if content and not content.endswith("\n"):
        content = content[:content.rfind("\n") + 1]

    lines = content.splitlines()
    batch = []
    for line in lines[cursor: cursor + BATCH_SIZE]:
        try:
            batch.append(json.loads(line))
        except json.JSONDecodeError:
            print(f"[telemetry] Skipping malformed line: {line!r}")
    return batch


def publish_batch(mqtt_connection, topic: str, records: list[dict]) -> int:
    """Stubbed — Vector now handles MQTT publishing. Returns 0."""
    return 0


def _run_loop(mqtt_connection, topic: str, stop_event: threading.Event) -> None:
    print("[telemetry] MQTT publishing is now handled by Vector. Thread parked.")
    stop_event.wait()


def start_telemetry_thread(mqtt_connection, topic: str) -> threading.Event:
    """Start the telemetry uplink as a daemon thread sharing an existing MQTT connection.

    Args:
        mqtt_connection: Active MQTT connection to publish on.
        topic: Full MQTT topic string (e.g. rooted/machines/<id>/telemetry).

    Returns:
        stop_event: Call stop_event.set() to gracefully stop the thread.
    """
    stop_event = threading.Event()
    thread = threading.Thread(
        target=_run_loop,
        args=(mqtt_connection, topic, stop_event),
        daemon=True,
        name="telemetry-uplink",
    )
    thread.start()
    return stop_event


if __name__ == "__main__":
    config    = get_device_config()
    device_id = config["device_id"]
    topic     = f"rooted/machines/{device_id}/telemetry"

    print(f"[telemetry] Device: {device_id}")
    print(f"[telemetry] Topic:  {topic}")
    print(f"[telemetry] Log:    {LOG_JSONL_PATH}")

    mqtt_connection = connect_to_aws_iot()
    stop_event      = start_telemetry_thread(mqtt_connection, topic)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[telemetry] Shutting down...")
    finally:
        stop_event.set()
        disconnect_from_aws_iot(mqtt_connection)
