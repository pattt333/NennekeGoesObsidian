# Nenneke-Regelbuch schreiben

## Grundsatz

Die Markdown-Dateien in vault/ sind die alleinige Quelle des Regelbuchs. Bearbeite Regeln direkt dort; die frühere LaTeX-Archiv- und Konvertierungskette wird nicht mehr verwendet. Git bewahrt ältere Stände nachvollziehbar auf.

## Eine Regelnotiz anlegen

Lege neue Regeln im passenden Unterordner von vault/rules/ an. Jede eigenständig zitierbare Regelnotiz beginnt mit diesem Metadatenblock:

~~~markdown
---
id: rule.kapitel.neue-regel
title: "Neue Regel"
type: rule
tags:
  - kapitel
---

# Neue Regel
~~~

- id ist dauerhaft, kleingeschrieben und punktgetrennt. Nach dem ersten Commit wird er auch bei einer späteren Verschiebung nicht geändert.
- title entspricht der sichtbaren Hauptüberschrift.
- type ist für Regelnotizen rule; die Grundideen des Regeldesigns verwenden design-principles.
- tags dienen nur dem thematischen Auffinden. Mindestens ein Tag ist erforderlich.

Nach größeren Ergänzungen aktualisiert npm run assign:ids fehlende Metadaten. Bestehende IDs werden dabei nicht überschrieben. Mit npm run validate:metadata prüfst du Eindeutigkeit und Vollständigkeit.

## Wiederkehrende Elemente

Nutze Überschriften in der Reihenfolge #, ## und bei Bedarf ###. Tabellen bleiben einfache Markdown-Tabellen:

~~~markdown
| Stufe | Wirkung |
| --- | --- |
| 1 | kurze Wirkung |
~~~

Im PDF erhält jede Markdown-Tabelle automatisch ein vollständiges, dezentes Raster: alle Zeilen und Spalten sind durch feine graue Linien getrennt. Dafür ist keine besondere Markdown-Syntax nötig; Obsidian und Docsify zeigen die Tabelle weiterhin mit ihrer eigenen Darstellung.

Regelboxen, Beispiele und Hinweise verwenden eine klare Zwischenüberschrift:

~~~markdown
## Regelbox: Schwierige Probe

Der Regeltext.

## Beispiel: Eine Probe am Spieltisch

Die Anwendung im Spiel.
~~~

Formeln stehen allein und erläutern unmittelbar darunter ihre Variablen:

~~~markdown
Ergebnis = 1W20 + Fertigkeitswert
~~~

Lege Bilder nur an, wenn sie einen Regelinhalt erklären, in vault/images/ ab und verwende einen relativen Link. Ohne Bildaussage gehört kein Platzhalter ins Regelbuch.

Auf eine fettgedruckte Bezeichnung kann direkt eine Aufzählung folgen. Der PDF-Build ergänzt für die Ausgabe den erforderlichen Abstand und erkennt diese in Obsidian übliche Schreibweise ebenfalls als Liste:

~~~markdown
**Talente:**
- Alchymie: Beschreibung
- Magiekunde: Beschreibung
~~~

## Bewusste Absatzabstände

Eine Leerzeile trennt zwei normale Absätze. Zusätzliche Leerzeilen innerhalb desselben Abschnitts sind erlaubt und haben Bedeutung: Der PDF-Build erhält jede weitere Leerzeile als zusätzlichen sichtbaren Abstand. So lassen sich eng zusammenhängende Regelabsätze bewusst von einem neuen Gedankengang absetzen, ohne Sonderformatierung einzufügen.

~~~markdown
Erster Absatz mit einer Regel.


Zweiter Absatz mit bewusst größerem Abstand im PDF.
~~~

Diese Abstände bleiben Teil der Markdown-Quelle; sie werden weder beim PDF-Build noch durch Validierungswerkzeuge entfernt. Innerhalb von Codeblöcken bleiben Leerzeilen immer unverändert und sind keine Layout-Anweisung.

## Gesundheitssegmenttabellen

Die Segmenttabellen in [Gesundheit](../vault/rules/05_Gesundheit.md) verwenden in ihren Kopfzellen semantische HTML-Spans. Sie bleiben normale Markdown-Tabellen; nur die Bezeichnungen der farbigen Bereiche erhalten eine Klasse:

~~~markdown
| Segment | <span class="health-segment--critical">1.</span> | <span class="health-segment--warning">5.</span> | <span class="health-segment--safe">7.+8. Wundfreisegment</span> |
| --- | --- | --- | --- |
~~~

- `health-segment--critical` kennzeichnet die kritischen Segmente 1 bis 4 und wird in `#f89883` dargestellt.
- `health-segment--warning` kennzeichnet die Segmente 5 und 6 und wird in `#fffea1` dargestellt.
- `health-segment--safe` kennzeichnet das wundfreie Segment 7.+8. und wird in `#80fa99` dargestellt.

Die Legende bei der Tabelle bleibt verpflichtend: Die Bedeutung der Bereiche muss auch ohne Farbe lesbar sein. Pflege die Werte weiter direkt als Tabellenzellen und erstelle weder eine Bildkopie noch eine gesonderte PDF-Quelle.

Docsify lädt die Darstellung automatisch aus `vault/styles/health-segment-tables.css`. Im Obsidian-Vault ist das Snippet bereits über `vault/.obsidian/appearance.json` aktiviert; nach einem frischen Klon genügt es, den Ordner `vault/` zu öffnen. Der PDF-Build wertet dieselben Klassen automatisch aus.

## Gemeinsame Obsidian-Konfiguration

Der Obsidian-Vault ist der Ordner `vault/`. Für alle gemeinsam versioniert werden nur zwei Obsidian-Dateien:

- `vault/.obsidian/appearance.json` aktiviert die gemeinsame Darstellung.
- `vault/.obsidian/snippets/health-segment-tables.css` definiert sie.

Arbeitsbereiche, zuletzt geöffnete Dateien, Graphansichten, persönliche Tastenkürzel und lokale Kern-Plugin-Einstellungen bleiben bewusst lokal und sind in `.gitignore` ausgeschlossen. Ergänze eine weitere Datei unter `vault/.obsidian/` nur dann als Ausnahme in `.gitignore`, wenn sie für jede Person beim Lesen oder Pflegen des Regelwerks zwingend benötigt wird.

## Überschriften zitieren

Eine Fundstelle besteht aus der stabilen Notiz-ID und einer Überschrift, zum Beispiel:

~~~text
rule.kampf.nahkampf · ## Angriff
~~~

Die Hauptüberschrift (#) benennt die Notiz. Unterabschnitte beginnen mit ##; sie sind die feinste zitierbare Ebene im automatischen RAG-Export. Vermeide mehrere verschiedene Regelthemen in einem einzelnen ##-Abschnitt.

## Verweise und Navigation

Für die Leseransicht bleiben relative Markdown-Links der Standard:

~~~markdown
[Nahkampf](../06_Kampf/01_Nahkampf.md)
~~~

Obsidian-Wikilinks sind weiterhin für die Vault-Navigation zulässig:

~~~markdown
[[rules/06_Kampf/01_Nahkampf|Nahkampf]]
~~~

Prüfe nach Änderungen stets mit:

~~~powershell
npm run validate:links
npm run validate:orphans
~~~

Die Inhaltsseiten und die Sidebar sind die Navigation für Obsidian und Docsify. Der PDF-Baum wird dort bewusst nicht verlinkt.

## PDF-Buchstruktur

book.yaml enthält nur Build-Einstellungen. Die Reihenfolge des Buchs steht ausschließlich in vault/book/index.md und seinen untergeordneten Dateien:

~~~markdown
![[chapters/06-kampf]]
~~~

In diesem PDF-Baum bedeutet ![[...]]: Diese Datei an dieser Stelle in das Buch einfügen. Ein normaler Wikilink [[...]] und ein Markdown-Link bleiben reine Querverweise und fügen keinen Text ein. Eine Notiz darf im Buch nur einmal eingebunden sein; fehlende Ziele, Schleifen und doppelte Einbindungen brechen den Build verständlich ab.

Die PDF-Erzeugung und die spätere Suche nutzen dieselben Metadaten:

~~~powershell
npm run book:resolve
npm run pdf
npm run rag:export
~~~

Das PDF liegt danach unter build/Nenneke.pdf, der providerneutrale Such-Export unter build/rag/rulebook.jsonl. Beide Dateien sind erzeugte Artefakte und werden nicht eingecheckt.

Jede Datei unter vault/book/chapters/ markiert ein Hauptkapitel. Der PDF-Build beginnt dessen erste eingebundene Regelnotiz automatisch auf einer neuen Seite; die Kapiteldatei selbst benötigt deshalb keine Überschrift.

## Zauber und Liturgien für die PDF auswählen

Die PDF enthält zunächst keine einzelnen Zauber oder Liturgien. Für jede gewünschte Ergänzung öffne vault/book/auswahl-magie/index.md und füge dort eine eigene ![[...]]-Zeile mit dem Pfad der bestehenden Regelnotiz ein. Diese Liste ist die einzige Auswahlstelle: Die Originaldatei bleibt unter vault/rules/ und erscheint dadurch weiterhin vollständig in Obsidian und Docsify.

Nach einer Änderung prüfst du die Auswahl mit npm run book:resolve und erzeugst das Buch mit npm run pdf.
