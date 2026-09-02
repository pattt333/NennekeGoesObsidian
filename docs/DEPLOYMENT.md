# Deployment Guide

This guide explains how to publish the NennekeObsidian vault as a static Docsify website on a personal server.

## Server setup

Install Git and Node.js 18 or later, then clone the repository:

```bash
cd /opt
sudo git clone https://github.com/pattt333/NennekeObsidian.git
sudo chown -R "$USER":"$USER" NennekeObsidian
cd NennekeObsidian
```

For a dedicated service account, adjust ownership after cloning:

```bash
sudo useradd -r -s /bin/false nenneke
sudo chown -R nenneke:nenneke /opt/NennekeObsidian
```

## Local preview

Install the Docsify command-line tool, then serve the vault:

```bash
sudo npm install -g docsify-cli
cd /opt/NennekeObsidian
docsify serve ./vault
```

Open `http://localhost:3000` to check the published rulebook.

## Production web server

Use either provided configuration as a starting point. Replace the placeholder domain and ensure the document root points at `/opt/NennekeObsidian/vault`.

### Caddy

Install Caddy, then copy and edit the included configuration:

```bash
sudo cp /opt/NennekeObsidian/docs/Caddyfile /etc/caddy/Caddyfile
sudo nano /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Caddy obtains HTTPS certificates automatically when DNS is configured for the chosen domain.

### nginx

Copy the included configuration into an nginx site, adjust the domain and root path, then test and reload nginx:

```bash
sudo cp /opt/NennekeObsidian/docs/nginx.conf /etc/nginx/sites-available/nenneke
sudo nano /etc/nginx/sites-available/nenneke
sudo ln -s /etc/nginx/sites-available/nenneke /etc/nginx/sites-enabled/nenneke
sudo nginx -t
sudo systemctl reload nginx
```

Configure HTTPS with Certbot or your preferred certificate management method.

## Backups and updates

Use the repository scripts to update and back up the vault. Before deploying a content change, run the link check from the repository root:

```bash
npm run validate:links
npm run validate:metadata
npm run validate:orphans
./scripts/backup-vault.sh
./scripts/sync-vault.sh
```

Review `docs/MAINTENANCE.md` for the full maintenance-script reference.

## PDF-Ausgabe

Nach jedem erfolgreichen Push auf `main` validiert GitHub Actions das Regelbuch, erzeugt die PDF und veröffentlicht sie automatisch als GitHub Release. Die erste automatisch erstellte Release ist `v6.3.1`; jeder folgende erfolgreiche `main`-Build erhöht die Patch-Version (`v6.3.2`, `v6.3.3` usw.). Die PDF wird dabei als `Nenneke-vX.Y.Z.pdf` an die jeweilige Release angehängt. Es wird keine PDF-Datei in das Repository zurückgeschrieben.

Damit die Action Tag und Release anlegen darf, muss einmalig im GitHub-Repository unter **Settings → Actions → General → Workflow permissions** die Option **Read and write permissions** erlaubt sein. Wird diese Einstellung durch eine Organisation oder ein Ruleset eingeschränkt, muss sie dort entsprechend freigegeben werden.

Zum Herunterladen öffnest du im GitHub-Repository den Bereich **Releases**, wählst die gewünschte Nenneke-Version und lädst die angehängte PDF herunter. Die gleiche unversionierte Datei ist weiterhin im erfolgreichen Workflow-Lauf unter **Actions → Regelbuch-PDF → Artifacts → Nenneke-PDF** verfügbar.

Ein manuell gestarteter Workflow dient nur der Validierung und dem PDF-Build. Er erstellt absichtlich weder Tag noch Release, damit ein erneuter Testlauf keine neue Regelwerksversion veröffentlicht. Lokal ist dieselbe Ausgabe mit `npm run pdf` möglich; sie benötigt Pandoc und Typst.

## Troubleshooting

### Site does not load

- Check the web server: `sudo systemctl status caddy` or `sudo systemctl status nginx`.
- Verify that the configured root is `/opt/NennekeObsidian/vault`.
- Check permissions with `ls -la /opt/NennekeObsidian/vault`.

### HTTPS certificate errors

- For Caddy, confirm the domain's DNS points to the server and inspect the Caddy service log.
- For nginx, verify the configured certificate paths and run `sudo certbot renew --dry-run` when using Certbot.

### Backup script fails

- Inspect `/var/log/vault-backup.log`.
- Ensure Git credentials are configured for the server.
- Ensure the backup directory exists and is writable.

## Quick reference

| Service | Start | Stop | Status | Logs |
| --- | --- | --- | --- | --- |
| Caddy | `sudo systemctl start caddy` | `sudo systemctl stop caddy` | `sudo systemctl status caddy` | `sudo journalctl -u caddy -f` |
| nginx | `sudo systemctl start nginx` | `sudo systemctl stop nginx` | `sudo systemctl status nginx` | `tail -f /var/log/nginx/error.log` |
