## 1. Versionierte Obsidian-Konfiguration reduzieren

- [ ] 1.1 `.gitignore` so ergänzen, dass Root-Obsidian-Zustand und persönliche Vault-Konfiguration ignoriert werden, während `vault/.obsidian/appearance.json` und das Segmenttabellen-Snippet ausdrücklich erhalten bleiben.
- [ ] 1.2 Die überflüssigen Root-Obsidian-Dateien sowie `vault/.obsidian/app.json` und `vault/.obsidian/core-plugins.json` aus dem Git-Index entfernen, ohne lokale Nutzerdateien zu löschen.
- [ ] 1.3 Prüfen, dass keine Root-`.obsidian`-Datei und ausschließlich die zwei vorgesehenen Vault-Dateien weiter verfolgt werden.

## 2. Gemeinsame Pflege dokumentieren

- [ ] 2.1 Die deutschsprachige Autorendokumentation um die Trennung zwischen gemeinsamer Darstellung und persönlichem Obsidian-Zustand ergänzen.

## 3. Validierung und Übergabe

- [ ] 3.1 Die JSON-Syntax der verbleibenden `vault/.obsidian/appearance.json` prüfen.
- [ ] 3.2 Mit `git check-ignore --no-index` repräsentative persönliche Obsidian-Dateien prüfen.
- [ ] 3.3 `npm run validate:links` ausführen.
- [ ] 3.4 Die Aktivierung des Segmenttabellen-Snippets in einem frisch bzw. ohne lokalen Zustand geöffneten Vault manuell prüfen.
- [ ] 3.5 Den aufgabenspezifischen Diff prüfen und nach erfolgreicher Validierung automatisch mit einer knappen Conventional-Commit-Nachricht committen; dabei keine vorhandenen Nutzeränderungen, Canvas- oder Base-Dateien aufnehmen.
