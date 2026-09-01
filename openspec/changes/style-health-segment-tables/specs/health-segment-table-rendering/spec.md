## ADDED Requirements

### Requirement: Gesundheitssegmenttabellen verwenden semantische Bereiche
Die Gesundheitssegment- und Wundabzugstabellen in `vault/rules/05_Gesundheit.md` SHALL die Bereiche kritisch, Warnbereich und wundfrei durch semantische, für den Renderer auswertbare Markierungen kennzeichnen. Sichtbare technische Farbcode-Texte SHALL nicht Teil der Tabellenbeschriftungen sein.

#### Scenario: Regelabschnitt wird im Vault gelesen
- **WHEN** eine Leserin die Gesundheitsregeln in Obsidian öffnet
- **THEN** enthalten die Segmentüberschriften ihre lesbaren Bezeichnungen und Nummern ohne sichtbare Hex-Farbwerte

#### Scenario: Farbinformation ist nicht verfügbar
- **WHEN** die Tabellen ohne aktiviertes Stylesheet oder in einer nicht farbfähigen Darstellung gelesen werden
- **THEN** erklärt eine textliche Legende die Bedeutung der Segmentbereiche

### Requirement: Web- und Obsidianansicht heben Segmentbereiche einheitlich hervor
Die bereitgestellten Styles SHALL die semantisch markierten Kopfzellen in Docsify und nach Aktivierung des Obsidian-Snippets mit der festgelegten Farbpalette hervorheben: kritisch `#f89883`, Warnbereich `#fffea1` und wundfrei `#80fa99`. Nicht markierte Tabellen und Zellen SHALL davon unberührt bleiben.

#### Scenario: Gesundheitsseite wird in Docsify angezeigt
- **WHEN** `rules/05_Gesundheit.md` in der Docsify-Webansicht geöffnet wird
- **THEN** sind die markierten Segmentkopfzeilen in der festgelegten Farbpalette hinterlegt

#### Scenario: Snippet wird in Obsidian aktiviert
- **WHEN** das mitgelieferte Snippet in Obsidian aktiviert ist und die Gesundheitsseite geöffnet wird
- **THEN** entspricht die farbliche Zuordnung der Segmentkopfzeilen der Docsify-Webansicht

### Requirement: PDF-Build erhält die Segmentfarben
Der Regelbuch-PDF-Build SHALL die semantischen Segmentmarkierungen auswerten und die zugehörigen Tabellenkopfzeilen mit derselben Farbpalette wie die Web- und Obsidianansicht ausgeben.

#### Scenario: Regelbuch-PDF wird erzeugt
- **WHEN** `npm run pdf` erfolgreich ausgeführt wird
- **THEN** enthalten die Segment- und Wundabzugstabellen auf den Gesundheitsseiten farbige Kopfzellen für kritische, Warn- und wundfreie Bereiche

### Requirement: Pflege der Segmenttabellen ist dokumentiert
Die deutschsprachige Autorendokumentation SHALL erläutern, wie Segmenttabellen markiert, Farben zugeordnet und das Obsidian-Snippet aktiviert werden. Sie SHALL klarstellen, dass die Tabelle als Textquelle gepflegt und anschließend über den regulären PDF-Build ausgegeben wird.

#### Scenario: Neue Segmenttabelle wird ergänzt
- **WHEN** eine Autorin eine weitere Segmenttabelle mit dieser Darstellung anlegt
- **THEN** kann sie anhand der Dokumentation die semantischen Klassen und die richtige Farbzuordnung anwenden, ohne eine Bilddatei oder eine getrennte PDF-Quelle zu erstellen
