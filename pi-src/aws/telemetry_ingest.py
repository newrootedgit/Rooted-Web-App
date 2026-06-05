#!/usr/bin/env python3
"""
UDP Telemetry Ingest

Listens on UDP port 9999 for CSV datagrams from the ClearCore microcontroller,
parses STATUS_UPDATE and EVENT frames, and appends each as a JSON line to
/home/rooted/telemetry_log.jsonl for downstream consumption by Vector.

ClearCore CSV format (schema version 2). The field layout is machine-type
specific; type is derived from the device name at startup. Faults are emitted
solely as EVENT frames (no fault flags on the status frame).

SEEDER:
  STATUS_UPDATE,2,boot_id,seq,uptime_ms,belt_motor_uptime_ms,roller_motor_uptime_ms,
                cmd_age_ms,udp_fail,trays_processed,active_variety,active_variety_name
  EVENT,2,boot_id,seq,uptime_ms,event_code,event_value,motor

HARVESTER (belt + blade, no torque/roller/trays/variety):
  STATUS_UPDATE,2,boot_id,seq,uptime_ms,belt_motor_uptime_ms,blade_motor_uptime_ms,cmd_age_ms
  EVENT,2,boot_id,seq,uptime_ms,event_code,event_value,motor
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
EXPECTED_SCHEMA_VER = 2

# Field order per frame type, keyed by machine type (after type and schema_ver).
# Names are the canonical keys the API consumes; omitted keys land as null.
# HARVESTER layouts are added when that firmware ships.
STATUS_FIELDS = {
    "SEEDER": [
        "boot_id", "seq", "uptime_ms",
        "belt_motor_uptime_ms", "roller_motor_uptime_ms",
        "cmd_age_ms", "udp_fail_count", "trays_processed",
        "active_variety", "active_variety_name",
    ],
    "HARVESTER": [
        "boot_id", "seq", "uptime_ms",
        "belt_motor_uptime_ms", "blade_motor_uptime_ms",
        "cmd_age_ms",
    ],
}

EVENT_FIELDS = {
    "SEEDER": [
        "boot_id", "seq", "uptime_ms",
        "event_code", "event_value", "motor",
    ],
    "HARVESTER": [
        "boot_id", "seq", "uptime_ms",
        "event_code", "event_value", "motor",
    ],
}

# Fields that stay as strings (everything else is parsed as int)
STRING_FIELDS = {"event_code", "motor", "active_variety_name"}


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


def get_machine_type(name: str | None) -> str:
    """Derive machine type from the device name (mirrors the API's getMachineType)."""
    upper = (name or "").upper()
    if upper.startswith("SEEDER"):
        return "SEEDER"
    if upper.startswith("HARVESTER"):
        return "HARVESTER"
    return "OTHER"


def parse_csv(raw: str, device_cfg: dict, machine_type: str, session_id: str) -> dict | None:
    """Parse a single CSV datagram into a JSON-serialisable dict.

    Returns None if the frame is malformed, an unsupported schema, or has a
    type/machine-type combination with no known field layout.
    """
    parts = raw.strip().split(",")
    if len(parts) < 3:
        return None

    frame_type = parts[0].strip().upper()
    schema_ver = _safe_int(parts[1].strip())

    if schema_ver != EXPECTED_SCHEMA_VER:
        print(f"[ingest] WARNING: unsupported schema_ver {schema_ver} (expected {EXPECTED_SCHEMA_VER}), skipping")
        return None

    if frame_type == "STATUS_UPDATE":
        field_map = STATUS_FIELDS
    elif frame_type == "EVENT":
        field_map = EVENT_FIELDS
    else:
        print(f"[ingest] WARNING: Unknown frame type '{frame_type}', skipping")
        return None

    fields = field_map.get(machine_type)
    if fields is None:
        print(f"[ingest] WARNING: no {frame_type} layout for machine type '{machine_type}', skipping")
        return None

    values = parts[2:]
    if len(values) < len(fields):
        print(
            f"[ingest] WARNING: {frame_type} has {len(values)} values, "
            f"expected {len(fields)}; parsing available trailing fields only"
        )
    elif len(values) > len(fields) and fields[-1] in STRING_FIELDS:
        # Re-join overflow (e.g. a comma inside active_variety_name) into the final string field
        values = values[:len(fields) - 1] + [",".join(values[len(fields) - 1:])]
    else:
        values = values[:len(fields)]

    record: dict = {
        "type": frame_type.lower(),  # "status_update" or "event"
        "schema_ver": schema_ver,
    }

    for field, val in zip(fields, values):
        val = val.strip()
        record[field] = val if field in STRING_FIELDS else _safe_int(val)

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
    machine_type = get_machine_type(device_cfg["device_name"])
    session_id = str(uuid.uuid4())
    count = 0

    print(f"[ingest] Device:     {device_cfg['device_id']}")
    print(f"[ingest] Name:       {device_cfg['device_name']} (type: {machine_type})")
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

            record = parse_csv(raw, device_cfg, machine_type, session_id)
            if record is not None:
                count += 1
                append_jsonl(record)
                # Compact summary for status_updates, full detail for events
                if record["type"] == "status_update":
                    print(f"[ingest] #{count} STATUS boot={record.get('boot_id')} seq={record.get('seq')} "
                          f"up={record.get('uptime_ms')}ms belt_up={record.get('belt_motor_uptime_ms')}ms "
                          f"roller_up={record.get('roller_motor_uptime_ms')}ms blade_up={record.get('blade_motor_uptime_ms')}ms "
                          f"torque={record.get('torque_pct')} trays={record.get('trays_processed')} "
                          f"variety={record.get('active_variety')} udp_fail={record.get('udp_fail_count')}")
                elif record["type"] == "event":
                    print(f"[ingest] #{count} EVENT  boot={record.get('boot_id')} seq={record.get('seq')} "
                          f"code={record.get('event_code')} motor={record.get('motor')} "
                          f"value={record.get('event_value')} torque={record.get('torque_pct')} "
                          f"up={record.get('uptime_ms')}ms")
            else:
                print(f"[ingest] SKIPPED (parse returned None)")
        except Exception as exc:
            print(f"[ingest] ERROR: {exc}")


if __name__ == "__main__":
    main()