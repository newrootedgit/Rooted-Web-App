#!/usr/bin/env python3
"""
UDP Telemetry Ingest

Listens on UDP port 9999 for CSV datagrams from the ClearCore microcontroller,
parses STATUS_UPDATE and EVENT frames, and appends each as a JSON line to
/home/rooted/telemetry_log.jsonl for downstream consumption by Vector.

New ClearCore CSV format (schema version 1):

STATUS_UPDATE,1,boot_id,seq,uptime_ms,belt_motor_uptime_ms,blade_motor_uptime_ms,
              torque_pct,belt_fault,blade_fault,alert_bits,kill_switch,cmd_age_ms,udp_fail,tray_count

EVENT,1,boot_id,seq,uptime_ms,event_code,value,belt_motor_uptime_ms,blade_motor_uptime_ms,
      belt_fault,blade_fault,alert_bits,kill_switch,cmd_age_ms,udp_fail
"""

import json
import os
import socket
import sys
import time
import uuid

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

UDP_HOST = "0.0.0.0"
UDP_PORT = 9999
JSONL_PATH = "/home/rooted/telemetry_log.jsonl"
CONFIG_PATH = "/opt/rooted-ble/device_config.json"
BUFFER_SIZE = 1024

# Fields in order for each frame type (after type and schema_ver)
STATUS_FIELDS = [
    "boot_id", "seq", "uptime_ms",
    "belt_motor_uptime_ms", "blade_motor_uptime_ms",
    "torque_pct", "belt_fault", "blade_fault",
    "alert_bits", "kill_switch", "cmd_age_ms", "udp_fail", "tray_count",
]

EVENT_FIELDS = [
    "boot_id", "seq", "uptime_ms",
    "event_code", "value",
    "belt_motor_uptime_ms", "blade_motor_uptime_ms",
    "belt_fault", "blade_fault",
    "alert_bits", "kill_switch", "cmd_age_ms", "udp_fail",
]

# Fields that stay as strings (everything else is parsed as int)
STRING_FIELDS = {"event_code"}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def load_device_config() -> dict:
    """Load device_id and device_name from the on-disk config file."""
    try:
        with open(CONFIG_PATH, "r") as f:
            cfg = json.load(f)
        return {
            "device_id": cfg["device_id"],
            "device_name": cfg.get("device_name", "unknown"),
        }
    except Exception as exc:
        print(f"[ingest] WARNING: Could not load {CONFIG_PATH}: {exc}")
        return {"device_id": "unknown", "device_name": "unknown"}


def parse_csv(raw: str, device_cfg: dict, session_id: str) -> dict | None:
    """Parse a single CSV datagram into a JSON-serialisable dict.

    Returns None if the frame is malformed or has an unknown type.
    """
    parts = raw.strip().split(",")
    if len(parts) < 3:
        return None

    frame_type = parts[0].strip().upper()
    schema_ver = parts[1].strip()

    if frame_type == "STATUS_UPDATE":
        fields = STATUS_FIELDS
    elif frame_type == "EVENT":
        fields = EVENT_FIELDS
    else:
        print(f"[ingest] WARNING: Unknown frame type '{frame_type}', skipping")
        return None

    values = parts[2:]
    if len(values) < len(fields):
        print(
            f"[ingest] WARNING: {frame_type} has {len(parts)} fields, "
            f"expected {len(fields) + 2}; parsing available trailing fields only"
        )
    values = values[:len(fields)]

    record: dict = {
        "type": frame_type.lower(),  # "status_update" or "event"
        "schema_ver": _safe_int(schema_ver),
    }

    for field, val in zip(fields, values):
        val = val.strip()
        if field in STRING_FIELDS:
            record[field] = val
        else:
            record[field] = _safe_int(val)

    # Rename 'value' → 'event_value' for events to match API schema
    if "value" in record:
        record["event_value"] = record.pop("value")

    # Rename 'udp_fail' → 'udp_fail_count' to match API schema
    if "udp_fail" in record:
        record["udp_fail_count"] = record.pop("udp_fail")

    # Rename 'tray_count' → 'trays_processed' to match API schema
    if "tray_count" in record:
        record["trays_processed"] = record.pop("tray_count")

    # Add metadata
    record["device_id"] = device_cfg["device_id"]
    record["device_name"] = device_cfg["device_name"]
    record["received_at"] = time.time()
    record["session_id"] = session_id

    return record


def _safe_int(s: str) -> int | None:
    """Parse a string to int, returning None on failure."""
    try:
        return int(s)
    except (ValueError, TypeError):
        return None


def append_jsonl(record: dict) -> None:
    """Append a single JSON record to the JSONL log file."""
    with open(JSONL_PATH, "a") as f:
        f.write(json.dumps(record) + "\n")


# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------

def main() -> None:
    # Flush prints immediately so journalctl shows them in real time
    sys.stdout.reconfigure(line_buffering=True)

    device_cfg = load_device_config()
    session_id = str(uuid.uuid4())
    count = 0

    print(f"[ingest] Device:     {device_cfg['device_id']}")
    print(f"[ingest] Session:    {session_id}")
    print(f"[ingest] Listening:  {UDP_HOST}:{UDP_PORT}")
    print(f"[ingest] JSONL path: {JSONL_PATH}")

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.bind((UDP_HOST, UDP_PORT))
    print(f"[ingest] Socket bound, waiting for packets...")

    while True:
        try:
            data, addr = sock.recvfrom(BUFFER_SIZE)
            raw = data.decode("utf-8", errors="replace").strip()

            print(f"[ingest] UDP from {addr[0]}:{addr[1]} ({len(data)}B): {raw[:120]}")

            record = parse_csv(raw, device_cfg, session_id)
            if record is not None:
                count += 1
                append_jsonl(record)
                # Compact summary for status_updates, full detail for events
                if record["type"] == "status_update":
                    print(f"[ingest] #{count} STATUS boot={record.get('boot_id')} seq={record.get('seq')} "
                          f"up={record.get('uptime_ms')}ms belt_up={record.get('belt_motor_uptime_ms')}ms "
                          f"blade_up={record.get('blade_motor_uptime_ms')}ms torque={record.get('torque_pct')}% "
                          f"faults=b{record.get('belt_fault')}/s{record.get('blade_fault')} "
                          f"kill={record.get('kill_switch')} udp_fail={record.get('udp_fail_count')} "
                          f"trays={record.get('trays_processed')}")
                elif record["type"] == "event":
                    print(f"[ingest] #{count} EVENT  boot={record.get('boot_id')} seq={record.get('seq')} "
                          f"code={record.get('event_code')} value={record.get('event_value')} "
                          f"up={record.get('uptime_ms')}ms")
            else:
                print(f"[ingest] SKIPPED (parse returned None)")
        except Exception as exc:
            print(f"[ingest] ERROR: {exc}")


if __name__ == "__main__":
    main()
