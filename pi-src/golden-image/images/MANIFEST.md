# Golden images

Newest first. Use the image marked CURRENT.

The image files are gitignored (\*.img.gz). This manifest is committed so the
provenance and checksums are versioned even though the bytes are not.
Verify a copy before trusting it:  shasum -a 256 -c <(grep <name> MANIFEST.md)

## rooted-golden-20260916  (CURRENT - use this one)

- sha256: d76bd425298b1747e8217dd5c82596c2126ea966e3d3279ff4d5cd0e767130bf
- size: 2,133,879,775 bytes compressed; decompresses to exactly 31,268,536,320
  bytes, which is the eMMC's byte size - verified, so the image is complete and
  not truncated.
- built: 2026-09-16 from the HARVESTER-koppert-1 reference build, repo d96f049.
  Clean pre-capture audit, both watchdog units enabled, BLE watchdog present.
- **First image carrying the te-cli toolchain** (Grayhill te-cli pinned at
  0074c49bc150, venv, hid bindings, 99-gh-te.rules udev rules), so seeders no
  longer need ~10 minutes of manual install. Also carries the eth0
  RequiredForOnline fix that v2 predates.

### Known: office WiFi traces in unallocated space (assessed, accepted)

Risk accepted by the owner 2026-09-16. Recovering this requires carving deleted
blocks out of the raw eMMC; the customers are growers who will never touch the
filesystem. Recorded here so the next person finds a decision rather than a
surprise. Rotating the office WiFi password retires it entirely, in v2 and v3
at once, whenever convenient.

The live filesystem is clean: `/etc/netplan` holds no credential, only the
setup hotspot profile survives, and a machine flashed from this will expose
nothing through its files. The capture verified all of that and refused to
proceed until it passed.

The RAW image is a different story. Scanning it returns:

```
241  urbanfarms                          (v2 returned 272)
  8  50-cloud-init.yaml.bak-<epoch>      (the deleted backups, by name)
 12  password: "<value present>"
  2  key-management: "psk"
```

Deleting a file unlinks it; it does not erase its blocks. The zero-fill
(`dd if=/dev/zero of=/ZEROFILL`) reclaims *free space*, but cannot touch the
ext4 **journal**, which is a fixed allocated region and is exactly where
recently-deleted directory entries and small-file data live. Four hits per
deleted filename is the signature of journal residue.

So verifying at the filesystem layer - which is what the capture does - proves
what a running machine exposes and says nothing about what is carvable from the
raw bytes. The raw bytes are what ships in an image file and onto every eMMC
flashed from it.

**Unblocking it:** rotate the office WiFi password. That makes all 241 traces
worthless in v2 and v3 alike, and this image becomes shippable with no
recapture. Until then, bench use only.

**Preventing it:** the root cause is that the reference machine was ever joined
to the office WiFi. Provision the next reference build over ethernet only, so
no office credential touches it and there is nothing for the journal to retain.
A capture-time scrub cannot reliably fix this after the fact - the journal is
not free space, so no amount of zero-filling a mounted root filesystem reaches
it.

---

## rooted-golden-20260911  (SUPERSEDED - contains the office WiFi credential)

> **Withdrawn 2026-09-16.** This image carries the office WiFi network. Scanning
> the released `.img.gz` returns 272 hits for the office SSID, and both
> `/etc/netplan/50-cloud-init.yaml.bak-1788912236` and `...-1789074772` are
> present in it. Those are backups `setup-nm.sh` / `setup-ethernet.sh` take of
> the cloud-init netplan before rewriting it, so they hold the passphrase in
> plaintext at mode 600. Nothing cleaned them up and the capture never looked
> in `/etc/netplan` - it verified only `/boot/firmware`, and only for a 64-char
> hex PSK, which a plaintext passphrase does not match.
>
> The same applies to the Google Drive copy. Fixed in `build-golden-image.sh`
> (2d64f13): the capture now removes those backups and fails, rather than warns,
> if any file under `/etc/netplan` still carries a password/psk/passphrase key.
>
> Usable for internal bench work. Do not flash it for a customer machine, and
> rotate the office WiFi password. Superseded by v3 once captured.

- sha256: 3d518c0910edea217c7bfff0edfcfb68e68c75f0500b75e0a4b71009f8c8a1d3
- offsite backup: Google Drive, Urban Farms / Quality Control / Golden Images.
  Verified 2026-09-15 by streaming the full file back and re-hashing it -
  byte-identical. Re-verify the same way after any future upload; a matching
  filename and size do not prove the bytes survived.
- size: 2.2G compressed (spans the full 31GB eMMC; free space zeroed)
- built: 2026-09-11 from the HARVESTER-koppert-1 reference build, repo commit
  09bd94d. Captured after a clean pre-capture audit: every tracked Pi-side file
  checksum-matched the repo, and the SSH watchdog, sshd-keygen unit and BLE
  advertising watchdog were all asserted present.
- carries /etc/rooted-image-release, so machines report their own lineage
  (`cat /etc/rooted-image-release`) and personalize-pi.sh records the image id
  in DEPLOYMENTS.csv automatically.

### What v2 fixes over 20260910

- **BLE advertising no longer dies permanently.** A central connecting and
  disconnecting - including a failed pairing attempt - used to tear down the
  mgmt advertising instance for good, leaving the machine invisible to every
  scanner while rooted-ble still reported healthy. The customer could then
  neither onboard the machine nor change its WiFi. `_advertising_watchdog` in
  provisioner.py re-arms within 30s (measured: ~10s).
- **The captive-portal hotspot is joinable.** It previously used a random WPA
  key generated by nmcli that existed only on that machine and could only be
  read by someone already logged in - so the WiFi-change fallback was unusable
  fleet-wide. Now pinned to the documented fleet password.
- **Hardening baked in:** openssh and kernel held from unattended upgrades (an
  unattended openssh upgrade previously left a machine unreachable), sshd as a
  plain always-listening service with a watchdog timer, and host-key
  regeneration on first boot.

## rooted-golden-20260910  (SUPERSEDED - binary deleted 2026-09-15)

- sha256: 1ce7ba7ca2ac05debe0a62b6a255974e08c0c7101b8e4d47ad28062cc767a260
- **Binary deliberately deleted**, not lost. v2 supersedes it and fixes two
  customer-facing faults this image carries: BLE advertising dying permanently
  after a disconnect, and an unjoinable captive-portal hotspot. Keeping it
  risked someone flashing it by mistake. Details kept for provenance only.
- size: 2.2G compressed (spans the full 31GB eMMC; free space zeroed)
- built: 2026-09-10, from the HARVESTER_Koppert_1 reference build
  (Ubuntu 24.04, CM5), de-personalized by build-golden-image.sh and
  verified 27/27 by verify-pi.sh through a cold boot before capture
- contains: all apt packages + venv + Vector binary, NetworkManager handover,
  captive portal, systemd units (rooted-iot/-vector disabled until
  personalization), sshd-keygen unit + ssh watchdog, unattended-upgrades
  blacklist (openssh, kernel), eth0 static 192.168.10.1, Tailscale package
  (no state), pristine rooted-telemetry.toml.template
- contains NO: device identity, IoT certs, WiFi credentials, SSH host keys,
  machine-id, Tailscale node state
- machine type (SEEDER vs HARVESTER) is NOT baked in - it is set by the
  machine name at personalize time; one image serves every type
- restore (~2.5 min - conv=sparse skips the zeroed space; drop it only when
  re-flashing a module that held customer data and must be fully overwritten):
    gunzip -c rooted-golden-20260910.img.gz | sudo dd of=/dev/rdiskN bs=4m conv=sparse
- then: ../personalize-pi.sh --machine <TYPE-customer-n> --office-wifi --reboot
- note: this image predates /etc/rooted-image-release, so machines flashed
  from it appear in DEPLOYMENTS.csv as "unknown-pre-release-image" - which
  uniquely means THIS image, as every later image carries the release file
