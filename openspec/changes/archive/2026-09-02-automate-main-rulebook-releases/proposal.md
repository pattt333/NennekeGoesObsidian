## Why

Die Regelbuch-PDF ist nach jedem Build verfügbar, muss bisher aber als vergängliches Workflow-Artefakt heruntergeladen werden. Eine erfolgreiche Änderung auf `main` soll stattdessen eine nachvollziehbare, dauerhaft veröffentlichte Regelwerksversion mit passender PDF erzeugen.

## What Changes

- Die bestehende PDF-Action erzeugt nach erfolgreichen Prüfungen auf `main` automatisch einen Git-Tag und eine GitHub Release mit der gebauten PDF.
- Die erste automatisch erzeugte Release trägt die bestehende Regelwerksversion `v6.3.1`; anschließende Releases erhöhen automatisch die Patch-Version.
- Manuell ausgelöste Workflow-Läufe behalten ihre Funktion als Prüf- und PDF-Läufe und erstellen keine Release.
- Die Bereitstellungsdokumentation erklärt Download, Versionsschema sowie die einmalig erforderliche GitHub-Berechtigung.
- Die Metadatenprüfung akzeptiert gültiges YAML-Frontmatter mit LF- und CRLF-Zeilenenden, damit der Build unabhängig von der lokalen Git-Zeilenenden-Einstellung verlässlich prüft.

## Capabilities

### New Capabilities

- Keine.

### Modified Capabilities

- `continuous-pdf-build`: Erfolgreiche Builds auf `main` veröffentlichen die PDF als versionierte GitHub Release statt ausschließlich als Workflow-Artefakt.

## Impact

- Betroffen sind `.github/workflows/build.yml` und `docs/DEPLOYMENT.md`.
- Der Release-Job benötigt die GitHub-Actions-Berechtigung `contents: write`; es werden keine Secrets, Fremddienste oder generierten Dateien im Repository benötigt.
- Die noch offene Roadmap-Planung zur kontinuierlichen PDF-Erstellung wird an die beschlossene Release-Veröffentlichung angepasst.

## Validation Impact

- Die Workflow-Syntax und die lokale Versionsberechnung werden geprüft.
- Die bestehenden lokalen Regelbuch-, Metadaten-, Link- und Orphan-Prüfungen laufen unverändert.
- Der erste echte Release-Lauf wird nach dem Push durch GitHub Actions verifiziert.
