# Golden images

The image files are gitignored (\*.img.gz). This manifest is committed so the
provenance and checksums are versioned even though the bytes are not.
Verify a copy before trusting it:  shasum -a 256 -c <(grep <name> MANIFEST.md)

## rooted-golden-20260910.img.gz

- sha256: 1ce7ba7ca2ac05debe0a62b6a255974e08c0c7101b8e4d47ad28062cc767a260
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
- then: ../golden-image/personalize-pi.sh --machine <TYPE-customer-n> --office-wifi --reboot
- note: this image predates /etc/rooted-image-release, so machines flashed
  from it appear in DEPLOYMENTS.csv as "unknown-pre-release-image" - which
  uniquely means THIS image, as every later image carries the release file
