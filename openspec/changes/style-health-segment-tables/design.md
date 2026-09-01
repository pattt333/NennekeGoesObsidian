## Context

`vault/rules/05_Gesundheit.md` enthält drei Tabellen, deren Kopfzeilen im LaTeX-Original nach Segmentbereich eingefärbt waren. In der Markdown-Migration sind die Hexwerte als Text in die Kopfzellen gelangt. Die Tabelle wird zugleich im Obsidian-Vault, in der Docsify-Webansicht und über Pandoc/Typst in der Regelbuch-PDF verwendet.

Die Darstellung muss deshalb aus einer einzigen, gut editierbaren Inhaltsquelle entstehen. Reines GFM-Markdown bietet keine Klassen oder Hintergrundfarben für einzelne Tabellenzellen. Das bestehende PDF-Skript schreibt die aufgelösten Markdown-Dateien in `build/Nenneke.md` und ruft anschließend Pandoc mit Typst auf.

## Goals / Non-Goals

**Goals:**

- Die Segmentbereiche sind in allen drei Lesekontexten eindeutig und annähernd wie im Original farblich unterscheidbar: kritisch (`#f89883`), Warnbereich (`#fffea1`) und wundfrei (`#80fa99`).
- Die Tabellen bleiben als Text im Vault pflegbar, durchsuchbar und für den PDF-Build verwendbar.
- Die Farbzuordnung ist semantisch im Inhalt markiert und nicht von der Tabellenposition oder dem Dateinamen abhängig.
- Autorinnen und Autoren erhalten eine kurze deutschsprachige Anleitung, einschließlich der einmaligen Aktivierung des Obsidian-CSS-Snippets.

**Non-Goals:**

- Keine Ersetzung der Tabellen durch Bilddateien und keine allgemeine Styling-Sprache für beliebige Regelbuchtabellen.
- Keine Änderung der Regelwerte, Kapitelstruktur, Wikilinks oder Buchreihenfolge.
- Keine End-to-End-Test-Suite und keine automatische Änderung persönlicher Obsidian-Arbeitsbereichseinstellungen.

## Decisions

### Semantische Klassen an den Tabellenüberschriften verwenden

Die betroffenen Markdown-Tabellen verwenden in ihren Kopfzellen kurze HTML-`span`-Elemente mit Klassen für die drei Segmentzustände. Die Inhalte bleiben reguläre Markdown-Tabellen; die Klassen ersetzen ausschließlich die sichtbaren, nichtssagenden Farbcode-Texte.

Die Klassen benennen die Regelbedeutung statt einen Farbwert, zum Beispiel `health-segment--critical`, `health-segment--warning` und `health-segment--safe`. Dies trennt Inhalt und Darstellung, erlaubt eine zugängliche Legende und kann vom PDF-Filter eindeutig ausgewertet werden.

Alternative: Eine vollständige HTML-Tabelle mit Inline-Styles. Dies würde zwar in der Vorschau funktionieren, wäre aber deutlich aufwendiger zu pflegen und koppelte die Regelquelle an eine konkrete Darstellung.

### Gleiche Farbpalette über begrenzte Stylesheets ausliefern

Ein Stylesheet für Docsify und ein als Obsidian-Snippet abgelegtes Stylesheet verwenden dieselben Farbwerte und färben die umschließende Tabellenzelle der semantisch markierten Kopfzeile. Das Stylesheet wird auf die markierten Spans und ihre Tabellenzellen begrenzt, damit es keine anderen Tabellen verändert.

Docsify lädt sein Stylesheet über `vault/index.html`. Das Obsidian-Snippet wird versionskontrolliert im dafür vorgesehenen Snippet-Ordner bereitgestellt, aber nicht automatisch aktiviert; die Dokumentation beschreibt den einmaligen Opt-in. `workspace.json` und persönliche Darstellungspräferenzen bleiben unangetastet.

Alternative: Globale `nth-child`-Regeln für Tabellen aus `05_Gesundheit.md`. Diese wären bei späteren Spaltenänderungen fehleranfällig und nicht semantisch wiederverwendbar.

### PDF-Ausgabe aus den semantischen Markierungen ableiten

Der PDF-Build erhält einen kleinen, versionierten Pandoc-Lua-Filter. Er erkennt die Segmentklassen in den Tabellenkopfzeilen und übergibt den passenden Zellhintergrund an die Typst-Ausgabe. So bleiben die Markdown-Quelle und die PDF-Farbpalette gekoppelt, ohne eine zweite Tabelle oder eine Grafik zu pflegen.

Alternative: Ein vorgerendertes SVG/PNG in die PDF einbetten. Das wäre visuell exakt, verschlechtert jedoch Bearbeitbarkeit, Suche und Barrierefreiheit und erzeugt eine zweite zu pflegende Quelle.

### Bedeutung zusätzlich als Text erklären

Unmittelbar bei den Tabellen wird eine kurze Legende ergänzt, die die drei Bereiche in Text benennt. Die Regelinformation bleibt damit verständlich, wenn Farben nicht sichtbar oder nicht unterscheidbar sind.

## Risks / Trade-offs

- [Obsidian-Snippets sind nicht automatisch aktiv] → Die Anleitung beschreibt die Aktivierung; die Website- und PDF-Darstellung bleiben davon unabhängig.
- [Unterschiedliche Renderer behandeln CSS anders] → Die Darstellung wird mit einer eng begrenzten CSS-Auswahl in Docsify und Obsidian geprüft; der PDF-Filter setzt Farben unabhängig von CSS.
- [Pandoc- oder Typst-Update ändert die Tabellenausgabe] → Der vorhandene Skript-Selbsttest wird um die Erkennung der Segmentmarkierungen ergänzt und der PDF-Abschnitt wird bei Änderungen visuell geprüft.
- [Farbkodierung allein ist nicht zugänglich] → Die Legende benennt die Bereiche; Überschriftentexte und Zahlen bleiben unverändert lesbar.

## Content and Link Impact

Es werden keine Vault-Dateien verschoben, umbenannt oder neu verlinkt. Die drei Tabellen in `vault/rules/05_Gesundheit.md` werden inhaltlich bereinigt und um semantische Auszeichner sowie eine Legende ergänzt. Ihre Überschriften und damit bestehende Wikilinks beziehungsweise PDF-Anker bleiben erhalten. Daher sind keine Redirects oder Linkmigrationen erforderlich.

## Migration Plan

1. Farbcode-Text in den bestehenden Tabellen durch semantische Markierungen und eine Legende ersetzen.
2. Stylesheets und PDF-Filter hinzufügen sowie den Build-Aufruf erweitern.
3. Die Tabellen in Obsidian, Docsify und der PDF prüfen.
4. Bei Problemen lässt sich die Änderung durch Entfernen des Filters und der Stylesheets zurücknehmen; die Tabellen bleiben als lesbares Markdown erhalten.

## Validation Strategy

- `npm run rulebook:test` prüft die erweiterte Filter-/Skripterkennung.
- `npm run validate:links` prüft die unveränderte Vault-Navigation nach der Markdown-Anpassung.
- `npm run pdf` erzeugt die Regelbuch-PDF; die Gesundheitsseiten werden visuell gegen die definierte Farbpalette geprüft.
- `npm run serve` wird für eine fokussierte Docsify-Vorschau der Gesundheitsseite verwendet.
- Die Dokumentation enthält die manuelle Obsidian-Prüfung nach Aktivierung des Snippets. Es werden keine End-to-End-Tests eingeführt.
