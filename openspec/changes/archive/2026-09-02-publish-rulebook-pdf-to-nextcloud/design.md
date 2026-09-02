## Context

Der bestehende Release-Job baut die PDF, erstellt eine GitHub Release und hängt ihr eine versionierte Datei an. Der Zielordner in Nextcloud ist per WebDAV erreichbar; die erforderlichen GitHub Actions Secrets wurden durch die Wartung hinterlegt.

## Goals / Non-Goals

**Goals:**

- Nach jeder erfolgreichen automatischen Release ersetzt Nextclouds `Nenneke.pdf` durch genau die PDF dieser Release.
- Zugangsdaten bleiben ausschließlich in GitHub Actions Secrets.

**Non-Goals:**

- Keine Synchronisation des gesamten Vaults, keine Ordnererstellung und keine versionierten PDF-Kopien in Nextcloud.
- Manuelle Workflow-Läufe bleiben ohne Release und ohne Nextcloud-Upload.

## Decisions

### WebDAV-Upload nach der GitHub Release

Der bestehende Release-Job verwendet `curl --upload-file` mit Basic Authentication und lädt nach erfolgreicher GitHub Release `release/Nenneke.pdf` als `Nenneke.pdf` an die geheime Ordner-URL. So bleibt GitHub die versionsgenaue Ablage und Nextcloud die aktuelle Standardausgabe.

### Drei getrennte Secrets

`NEXTCLOUD_WEBDAV_URL`, `NEXTCLOUD_USERNAME` und `NEXTCLOUD_APP_PASSWORD` werden getrennt als Umgebungsvariablen eingebunden. Der Workflow gibt keine dieser Werte aus und verwendet das App-Passwort statt eines regulären Kontopassworts.

## Risks / Trade-offs

- [Ein Secret oder die Ziel-URL ist falsch] → Der Upload-Schritt schlägt sichtbar fehl; die GitHub Release bleibt als versionierte Sicherung verfügbar.
- [Nextcloud ist zeitweise nicht erreichbar] → Der Upload wiederholt vorübergehende Fehler und beendet den Lauf bei dauerhaftem Fehler sichtbar.

## Migration Plan

1. Release-Job und Dokumentation ergänzen.
2. Nach Push den ersten Lauf prüfen: GitHub Release `v6.3.1` und die ersetzte Nextcloud-Datei `Nenneke.pdf`.
3. Bei Bedarf den Upload-Schritt entfernen; PDF-Build und GitHub Release bleiben unabhängig erhalten.

## Validation Strategy

- Regelsatz, Metadaten, Links, Orphans und PDF lokal prüfen.
- Workflow-Diff auf Geheimnisbehandlung und korrekte Upload-Zieldatei prüfen.
