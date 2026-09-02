## Why

Der Repository-Stand enthält Obsidian-Dateien, die nur persönliche Ansichten, zuletzt geöffnete Dateien oder lokal aktivierte Kernfunktionen beschreiben. Sie erzeugen bei jeder Nutzung unnötige Git-Diffs, obwohl für den gemeinsamen Regelbuch-Vault lediglich die Aktivierung des Tabellen-Styles und dessen CSS benötigt werden.

## What Changes

- Die Root-Obsidian-Konfiguration wird aus dem aktuellen Projektstand entfernt und zukünftig ignoriert, weil der tatsächliche Leser-Vault unter `vault/` liegt.
- Die Vault-Konfiguration wird auf die zwei gemeinsamen Styling-Dateien reduziert: `vault/.obsidian/appearance.json` und `vault/.obsidian/snippets/health-segment-tables.css`.
- Persönlicher Vault-Zustand und lokal erzeugte Kern-Plugin-Konfiguration werden aus dem Git-Index entfernt und durch eindeutige Ignore-Regeln vor zukünftigen Commits geschützt.
- Die Autorendokumentation erläutert, welche Obsidian-Dateien bewusst gemeinsam gepflegt werden und welche lokal bleiben.
- Die bestehende Git-Historie wird nicht umgeschrieben.

## Capabilities

### New Capabilities

- `minimal-shared-obsidian-configuration`: Hält nur die für die gemeinsame Darstellung erforderliche Obsidian-Konfiguration versioniert und schützt persönlichen Obsidian-Zustand vor künftigen Commits.

### Modified Capabilities

- Keine.

## Impact

- Betroffene Konfiguration: `.gitignore`, der getrackte Root-Ordner `.obsidian/` sowie `vault/.obsidian/`.
- Betroffene Dokumentation: `docs/MARKDOWN_AUTHORING.md` oder eine gleichwertige deutschsprachige Maintainer-Dokumentation.
- `vault/.obsidian/appearance.json` und das Segmenttabellen-Snippet bleiben erhalten, sodass neue Klone die gemeinsame Farbgestaltung ohne individuelle Konfiguration laden.
- `Unbenannt.canvas` und `Unbenannt.base` sind potenzielle Vault-Inhalte und bleiben ausdrücklich außerhalb dieses Changes.
- Validation Impact: Git-Status und Ignore-Verhalten werden geprüft; die aktivierte Tabellen-Darstellung wird in Obsidian und Docsify kontrolliert. Es werden keine End-to-End-Tests ergänzt.
