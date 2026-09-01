## Why

Die Segmenttabellen in `vault/rules/05_Gesundheit.md` enthalten aus der LaTeX-Migration stammende Farbkennungen als sichtbaren Text. Standard-Markdown kann die im Original verwendeten farbigen Segmentbereiche nicht abbilden, obwohl diese für das schnelle Lesen der Gesundheitsregeln wichtig sind.

## What Changes

- Die Gesundheitssegment- und Wundabzugstabellen erhalten eine strukturierte, konsistent formatierte Darstellung ohne sichtbare Farbcode-Reste.
- Obsidian und die Docsify-Ansicht stellen kritische, mittlere und wundfreie Segmente mit derselben Farbzuordnung dar.
- Der PDF-Build überträgt diese Farbzuordnung in die erzeugte Regelbuch-PDF.
- Eine kurze deutschsprachige Dokumentation erklärt die Pflege der speziell formatierten Tabellen und die Bedeutung der Farben.

## Capabilities

### New Capabilities

- `health-segment-table-rendering`: Stellt die Gesundheitssegment-Tabellen im Vault, in Docsify und in der PDF-Ausgabe einheitlich und zugänglich dar.

### Modified Capabilities

- Keine.

## Impact

- Betroffene Vault-Inhalte: `vault/rules/05_Gesundheit.md` und gegebenenfalls die zugehörige Autorendokumentation.
- Betroffene Darstellung: ein neues, eingegrenztes Stylesheet für Obsidian und Docsify sowie die Einbindung in `vault/index.html`.
- Betroffener Build: `scripts/rulebook-tools.js` und ein kleiner, versionskontrollierter PDF-Filter oder eine gleichwertige Build-Ergänzung.
- Validation Impact: Markdown-Links werden geprüft; die Tabellen werden in Docsify, Obsidian und in der erzeugten PDF kontrolliert. Es werden keine End-to-End-Tests ergänzt.
