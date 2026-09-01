## 1. Semantische Tabellenquelle

- [x] 1.1 Die drei Segment- und Wundabzugstabellen in `vault/rules/05_Gesundheit.md` von sichtbaren Farbcode-Texten bereinigen und mit semantischen Bereichsmarkierungen versehen.
- [x] 1.2 Eine kurze, farbunabhängig verständliche Legende bei den Gesundheitssegmenttabellen ergänzen.

## 2. Einheitliche Bildschirmdarstellung

- [x] 2.1 Ein eng begrenztes Docsify-Stylesheet für die semantisch markierten Segmentkopfzeilen erstellen und in `vault/index.html` einbinden.
- [x] 2.2 Ein gleichwertiges, versionskontrolliertes Obsidian-CSS-Snippet bereitstellen, ohne persönliche Obsidian-Einstellungen zu ändern.
- [x] 2.3 Die deutschsprachige Autorendokumentation um Pflegehinweise, Farbbedeutungen und die Aktivierung des Obsidian-Snippets ergänzen.

## 3. PDF-Darstellung

- [x] 3.1 Einen versionierten Pandoc-/Typst-Filter erstellen, der die semantischen Segmentbereiche als farbige PDF-Tabellenkopfzeilen ausgibt.
- [x] 3.2 Den PDF-Build und seinen fokussierten Selbsttest so erweitern, dass der Filter bei der Regelbucherzeugung verwendet wird.

## 4. Validierung und Übergabe

- [x] 4.1 `npm run rulebook:test` ausführen.
- [x] 4.2 `npm run validate:links` ausführen.
- [x] 4.3 `npm run pdf` ausführen und die Gesundheitsseiten der erzeugten PDF visuell prüfen.
- [x] 4.4 Mit `npm run serve` die Gesundheitsseite in Docsify gezielt prüfen; die erforderliche manuelle Obsidian-Prüfung dokumentieren.
- [x] 4.5 Den aufgabenspezifischen Diff prüfen und nach erfolgreicher Validierung automatisch mit einer knappen Conventional-Commit-Nachricht committen.
