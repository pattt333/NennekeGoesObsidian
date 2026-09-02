## Context

Die PDF-Action läuft bereits bei jedem Push nach `main` und nach manueller Auslösung. Sie validiert den Vault, erstellt `build/Nenneke.pdf` und lädt die Datei als Workflow-Artefakt hoch. Die aktuelle Regelwerksversion ist 6.3.1; im Repository existiert noch kein Git-Tag.

## Goals / Non-Goals

**Goals:**

- Jede vollständig erfolgreiche Ausführung für einen Push nach `main` veröffentlicht genau eine GitHub Release mit der zu diesem Commit gehörenden PDF.
- Die Release-Tags folgen `vMAJOR.MINOR.PATCH`, beginnen bei `v6.3.1` und erhöhen danach nur `PATCH`.
- Die Workflow-Ausgabe bleibt zusätzlich als Artefakt verfügbar.
- Manuelle Läufe erzeugen keine Version und keine Release.

**Non-Goals:**

- Die Action ändert keine Quelldateien oder erzeugt keinen Release-Commit auf `main`.
- Die automatische semantische Einordnung von Regeländerungen in Major- oder Minor-Versionen ist nicht Teil dieses Schritts.
- Es werden keine Vorabversionen, GitHub Pages oder externen Publikationsdienste eingerichtet.

## Decisions

### 1. Ein Release pro erfolgreichem `main`-Push

Der Release-Job wird nur für `push`-Ereignisse auf `main` ausgeführt und hängt vom erfolgreichen PDF-Build ab. Damit veröffentlicht er keine defekte oder ungeprüfte PDF. `workflow_dispatch` bleibt als sicherer manueller Build ohne Release erhalten.

Alternative: Release nur durch manuelle Workflow-Eingabe. Dies wurde verworfen, weil jeder erfolgreiche `main`-Build unmittelbar die aktuelle Regelwerksversion bereitstellen soll.

### 2. Deterministische Patch-Nummerierung

Der Job liest den höchsten vorhandenen finalen `vMAJOR.MINOR.PATCH`-Tag. Fehlt ein solcher Tag, wird `v6.3.1` verwendet; andernfalls erhöht der Job dessen Patch-Teil. Das Tag zeigt auf genau den Commit des auslösenden Workflow-Laufs.

Alternative: Eine Versionsdatei in jedem Commit pflegen. Dies würde einen zweiten, manuell zu pflegenden Versionsstand schaffen und ist für den automatischen Haupt-Workflow nicht erforderlich.

### 3. GitHub-eigene Release-Werkzeuge und minimale Rechte

Der Release-Job verwendet die auf GitHub-hosted Runnern bereitstehende GitHub CLI mit dem automatisch bereitgestellten `GITHUB_TOKEN`. Nur dieser Job erhält `contents: write`; der Build-Job behält Leserechte. Ein serieller Concurrency-Abschnitt verhindert parallele Releases mit derselben Patch-Version.

Alternative: Eine externe Release-Action. Die GitHub CLI vermeidet eine weitere Abhängigkeit und stellt Tag sowie Release mit dem selben Repository-Token bereit.

### 4. Zeilenenden-unabhängige Frontmatter-Prüfung

Die Metadaten-Prüfung akzeptiert LF und CRLF als Frontmatter-Begrenzung und erhält beim automatischen Ergänzen bestehende Zeilenenden. Dadurch weichen lokale Prüfungen nicht mehr allein wegen der Git-Zeilenenden-Konfiguration von dem CI-Ergebnis ab.

## Risks / Trade-offs

- [Ein GitHub-Repository oder eine Organisation verbietet Schreibzugriffe für Actions] → Die Dokumentation benennt die einmalige Einstellung; der Job schlägt sichtbar fehl, ohne PDF oder Quelltext zu verändern.
- [Mehrere `main`-Pushes treffen schnell hintereinander ein] → Releases werden seriell abgearbeitet und berechnen ihren Tag erst nach dem Abruf aller Tags.
- [Ein Patch-Release wird für eine inhaltlich große Änderung zu klein bewertet] → Major- und Minor-Versionssprünge bleiben eine bewusst zu entscheidende Folgeänderung.
- [Lokale Zeilenenden lassen die Metadatenprüfung scheitern] → Der Parser behandelt LF und CRLF gleichwertig.

## Migration Plan

1. Workflow um den getrennten Release-Job und die Versionslogik erweitern.
2. Dokumentation von Artefakt-only auf Release-Download umstellen.
3. GitHub-Schreibberechtigung für Actions aktivieren und die Änderung nach `main` pushen.
4. Den ersten Lauf prüfen: Er erstellt `v6.3.1` mit `Nenneke-v6.3.1.pdf`.
5. Bei Problemen den Release-Job aus dem Workflow entfernen; die bewährte PDF-Artefakt-Erstellung bleibt bestehen.

## Validation Strategy

- Workflow-YAML und Shell-Syntax statisch prüfen.
- `npm run rulebook:test`, `npm run validate:metadata`, `npm run validate:links` und `npm run validate:orphans` lokal ausführen.
- Nach dem Push den GitHub-Actions-Lauf und die erzeugte Release visuell prüfen.
