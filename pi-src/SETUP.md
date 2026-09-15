# Pi setup — what's what

Three ways to set up a Pi live in this directory. This file says which is which,
so nobody has to reverse-engineer it from the scripts.

## The three paths

### A. Current flow (works today)

```
Raspberry Pi Imager (advanced options: hostname, rooted user, WiFi, SSH)
  └─ ./deploy-to-pi-one.sh     over WiFi   — packages, venv, Vector, files, eth0 static
  └─ ./deploy-to-pi-two.sh     over cable  — identity, IoT, NM, portal, services
  └─ ./verify-pi.sh --host 192.168.10.1
```

~30 min/machine. This is what's proven in the field.

### B. Current flow + stamp (optional, ~6 min faster)

Adds one step before booting: `provisioning/write-boot-config.sh` stamps
cloud-init onto the boot partition so the ~15 minutes of apt/venv/Vector happens
unattended during first boot. `deploy-to-pi-one.sh` then takes seconds.

Clearly worth it on an SD-card Pi (the card is already in the reader). Marginal
on a Compute Module, where you must re-enter usbboot mode and run `rpiboot`
again just to reach the boot partition.

### C. Golden image (in progress — for building at volume)

```
flash golden image → boot → cable to 192.168.10.1
  └─ golden-image/personalize-pi.sh    name, UUID, IoT certs, Tailscale
  └─ ./verify-pi.sh --host 192.168.10.1
```

Target ~15 min/machine, and **no WiFi needed during provisioning** — the image
already has the NetworkManager handover baked in, so nothing can drop your
session. WiFi is provisioned on site by the customer over BLE or the captive
portal, which is how the product works anyway.

## Directory map

| Path | What it is |
|---|---|
| `deploy-to-pi-one.sh` | Path A step 1. Everything needing internet on the Pi. |
| `deploy-to-pi-two.sh` | Path A step 2. Offline; identity + config. Needs the cable. |
| `finish-pi-setup.sh` | Recovery for a `deploy-to-pi-two.sh` that died mid-run. Duplicates its step 7 — superseded by path C. |
| `verify-pi.sh` | **Shared by all paths.** 25 checks incl. a real mTLS handshake to AWS IoT. Exit 0 only if everything passes. |
| `provisioning/` | Path B. The cloud-init stamp. |
| `golden-image/` | Path C. `bake-common.sh` (once), `build-golden-image.sh` (de-personalize + capture), `personalize-pi.sh` (per machine). |
| `setup-scripts/` | Run on the Pi: `setup-nm.sh`, `setup-ethernet.sh`, `provision-iot-device.sh`. |
| `wifi-setup/`, `captive-portal/` | Captive portal + hotspot. |
| `aws/` | Runs on the Pi: `telemetry_ingest.py`, `command_handler.py`. |
| `vector/` | Vector config template + unit. |
| `deploy-vector.sh` | Standalone Vector/ingest redeploy to an existing Pi. |
| `deploy-with-iot.sh`, `setup-aws-iot.sh` | Older one-shot deploy helpers. Not part of A/B/C. |

## Ordering rule that must not be broken

`setup-nm.sh` replaces `/etc/netplan/50-cloud-init.yaml` with an empty stub to
take `wlan0` away from netplan. That stub removes **everything** in that file —
including `eth0`'s config and the WiFi credentials.

So `setup-ethernet.sh` (which writes `99-eth0-static.yaml`, a separate
higher-numbered file that survives) **must run before** `setup-nm.sh`. In path A
that's guaranteed because `deploy-to-pi-one.sh` runs first. In path C it's baked
into the image.

Get this backwards and the Pi ends up with no network at all and needs HDMI to
recover. This has already happened once.

## What the machine NAME controls

Not cosmetic. Both `apps/api/src/domains/machine-domain/machineType.ts` and
`aws/telemetry_ingest.py` derive the machine type by **prefix match**:

```
startsWith("SEEDER")    -> SEEDER
startsWith("HARVESTER") -> HARVESTER
otherwise               -> OTHER
```

`OTHER` means telemetry frames are dropped (no field layout) and the parts API
returns an empty list — while every service still reports healthy. Name machines
`TYPE-customer-unit`, e.g. `HARVESTER-koppert-1`.

**`WASHER` is not a recognised type**, despite `deploy-to-pi-two.sh` listing it
as recommended. A washer classifies as `OTHER`.

## Office WiFi for bench testing

A machine from the golden image has **no WiFi credentials by design** — WiFi is
provisioned on site by the customer. On the bench that means it can't reach AWS
IoT, so `rooted-iot` crash-loops and you can't confirm the machine works.

`personalize-pi.sh --office-wifi` closes that gap, reading credentials from
`~/.rooted-office-wifi` — deliberately outside the repo, so it can never be
committed. Create it with:

```bash
bash -c 'read -rp "SSID [urbanfarms]: " S; S=${S:-urbanfarms}; read -rsp "Password: " P; echo; umask 077; printf "SSID=%s\nPSK=%s\n" "$S" "$P" > ~/.rooted-office-wifi; echo "saved (mode $(stat -f %Lp ~/.rooted-office-wifi))"'
```

Format is `SSID=` / `PSK=`, one per line, mode 600. The PSK may be a passphrase
or a 64-hex key.

**This must be removed before shipping.** NetworkManager stores the PSK in
`/etc/NetworkManager/system-connections/`, so a machine that ships with it
carries your office WiFi password into a customer facility:

```bash
ssh rooted@<host> "sudo nmcli connection delete urbanfarms"
```

`build-golden-image.sh` strips it automatically, along with the plaintext copy
cloud-init leaves in `/boot/firmware/network-config`.

## Tailscale auth key

Machines join the tailnet via a reusable, pre-authorized auth key with
`tag:rooted-machine`. Tagged devices have **no key expiry** - field machines
never fall off the tailnet. Only the auth key itself expires (90 days max),
and an expired key only blocks NEW joins at the bench; deployed machines are
unaffected.

One-time setup: in the admin console add
`"tagOwners": { "tag:rooted-machine": ["autogroup:admin"] }` to the ACL
policy, then Settings -> Keys -> Generate auth key (reusable, pre-authorized,
tag:rooted-machine, 90 days). Save it with:

```bash
bash -c 'read -rsp "Tailscale key: " K; echo; umask 077; printf "KEY=%s\nCREATED=%s\n" "$K" "$(date +%Y-%m-%d)" > ~/.rooted-tailscale-key; echo saved'
```

`personalize-pi.sh` reads the file automatically, warns when the key is 75+
days old, and on a failed join tells you it is likely expired and how to
recover. Re-run the same save command with a fresh key each quarter - the
script does the remembering.

## Proving it survives a power cycle

`systemctl start` proves a service runs. It does **not** prove it comes back
after a power cycle — wrong ordering or a missing `After=` only shows up on a
cold boot, and these machines get power-cycled in the field constantly.
`rooted-iot` and `rooted-vector` both depend on `network-online.target` and
`time-sync.target`, the usual sources of boot-order flakiness.

```bash
./golden-image/personalize-pi.sh --host 192.168.10.1 --reboot
```

reboots, waits for the Pi to answer, then runs `verify-pi.sh` automatically.

## The clock trap (why a field machine may never connect)

A Pi has no RTC, so its clock is wrong at every boot and must self-correct.
`rooted-iot` and `rooted-vector` are `After=time-sync.target`, and AWS IoT mTLS
validates certificate time windows - so an unsynced clock means the services
never start AND could not authenticate if they did.

The trap: `systemd-timesyncd` gates on **systemd-networkd's** online state, but
`setup-nm.sh` hands wlan0 to NetworkManager, leaving networkd managing only
eth0 - the direct-cable service port, normally UNPLUGGED. netplan's
`optional: true` does NOT emit `RequiredForOnline=no`, so networkd requires an
absent cable, reports `ONLINE_STATE=offline`, and timesyncd never even attempts
a sync: no log lines, no server selected, service looks healthy.

Found on a Pi 5 whose clock was 8 days stale with 23 systemd jobs queued behind
`systemd-time-wait-sync`, while NetworkManager reported `connected:full`.

`setup-ethernet.sh` now writes a networkd drop-in setting
`RequiredForOnline=no`, and verify-pi.sh fails on both an unsynced clock and
the underlying misconfiguration. To check a machine by hand:

```bash
timedatectl show -p NTPSynchronized --value          # must be yes
networkctl status eth0 | grep 'Required For Online'  # must be no
```

## Known issues, not yet fixed

- **BLE advertising dies after a client disconnects** (FIXED in provisioner.py,
  needs a golden image rebuild to ship). The mgmt advertising instance is torn
  down when a central disconnects - including a failed pairing attempt - and
  does not come back. rooted-ble stays `active` with zero restarts and its log
  still claims it is advertising, so nothing looks wrong; the machine is simply
  invisible to every BLE scanner and cannot be onboarded or have its WiFi
  changed. `_advertising_watchdog` now re-arms it within 30s, and verify-pi.sh
  fails on a dead advert. Machines from images before 2026-09-11 do not have
  this: recover with `sudo systemctl restart rooted-ble`.
- ~~**The captive-portal hotspot has a random, unknowable password.**~~ FIXED
  2026-09-11: `HOTSPOT_PASSWORD` is now pinned (default `RootedSetup2026`) and
  applied on both the create and update paths, so older machines are corrected
  on the next run. verify-pi.sh fails if a machine has any other key. Note this
  is a fleet-wide shared credential and the portal has no other auth - anyone in
  WiFi range who knows it can repoint a machine's WiFi.
- **`deploy-to-pi-two.sh` renders `rooted-telemetry.toml` in place.** Re-running
  it with a new UUID finds no `@@PLACEHOLDER@@` tokens left and silently keeps
  publishing under the previous device id. `verify-pi.sh` detects this; path C
  fixes it by rendering from a pristine `.toml.template`.
- **`harden-pi.sh` is referenced as canonical at `pi-src/harden-pi.sh`** by
  `rooted-machines-code/customer-code/superior-super-foods/harden-pi.sh`, but it
  does not exist here.
- ~~**HARVESTER telemetry layout may be stale.**~~ VERIFIED 2026-09-11 against
  `rooted-machines-code/customer-code/koppert/harvester/clearcore/autoadjust_harvester/`:
  the firmware emits `STATUS_UPDATE,2,bootId,seq,uptimeMs,belt_motor_uptime_ms,
  blade_motor_uptime_ms,cmdAgeMs`, which matches telemetry_ingest.py's HARVESTER
  field list exactly (6 fields, same order, schema_ver 2).
