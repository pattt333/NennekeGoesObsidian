## Why

Die GitHub Release enthält die versionierte Regelbuch-PDF, während die Gruppe eine immer aktuelle Standard-PDF in ihrem Nextcloud-Ordner nutzt. Diese Datei soll ohne manuellen Download nach jeder erfolgreichen Release aktualisiert werden.

## What Changes

- Der Release-Job lädt die bereits validierte PDF per WebDAV als `Nenneke.pdf` in den konfigurierten Nextcloud-Ordner hoch.
- Die WebDAV-Adresse, der Nextcloud-Benutzername und das App-Passwort werden ausschließlich als GitHub Actions Secrets verwendet.
- Die deutsche Bereitstellungsdokumentation beschreibt die Secrets und das Aktualisierungsverhalten.

## Capabilities

### New Capabilities

- Keine.

### Modified Capabilities

- `continuous-pdf-build`: Erfolgreiche Main-Branch-Releases stellen die aktuelle PDF zusätzlich im konfigurierten Nextcloud-Ordner bereit.

## Impact

- Betroffen sind `.github/workflows/build.yml` und `docs/DEPLOYMENT.md`.
- Es wird die vorhandene `curl`-Funktion des GitHub-hosted Runners verwendet; neue Abhängigkeiten oder eingecheckte Zugangsdaten sind nicht nötig.

## Validation Impact

- Die Workflow-Änderung wird statisch geprüft sowie der reguläre lokale PDF- und Regelbuchcheck ausgeführt.
- Der erste GitHub-Lauf bestätigt den authentifizierten Upload, ohne Secrets in Logs oder Dokumentation offenzulegen.
