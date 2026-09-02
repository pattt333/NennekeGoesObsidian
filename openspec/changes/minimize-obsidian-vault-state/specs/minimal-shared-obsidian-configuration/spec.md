## ADDED Requirements

### Requirement: Gemeinsame Obsidian-Konfiguration ist auf die Darstellung begrenzt
Das Repository SHALL ausschließlich `vault/.obsidian/appearance.json` und `vault/.obsidian/snippets/health-segment-tables.css` als gemeinsame Obsidian-Konfiguration verfolgen. Es SHALL keine Root-`.obsidian`-Datei verfolgen.

#### Scenario: Neuer Klon wird als Vault geöffnet
- **WHEN** eine Leserin den Ordner `vault/` eines frischen Klons in Obsidian öffnet
- **THEN** ist das Segmenttabellen-Snippet über die gemeinsame `appearance.json` aktiviert

#### Scenario: Git-Index wird geprüft
- **WHEN** eine Maintainerin die verfolgten Obsidian-Dateien auflistet
- **THEN** enthält die Liste nur die zwei vorgesehenen Vault-Dateien und keine Root-`.obsidian`-Datei

### Requirement: Persönlicher Obsidian-Zustand bleibt lokal
Das Repository SHALL Root-Obsidian-Konfiguration, Vault-Arbeitsbereich, App- und Kern-Plugin-Zustand sowie übliche persönliche Ansichten ignorieren. Diese Dateien SHALL bei gewöhnlichem Arbeiten mit Obsidian keinen Git-Diff erzeugen.

#### Scenario: Obsidian aktualisiert persönliche Ansicht
- **WHEN** Obsidian eine Arbeitsbereichs- oder lokale Plugin-Einstellung schreibt
- **THEN** zeigt `git status` diese persönliche Datei nicht als unversionierte oder geänderte Projektdatei an

### Requirement: Gemeinsame und persönliche Konfiguration ist dokumentiert
Die deutschsprachige Autorendokumentation SHALL die zwei gemeinsam versionierten Obsidian-Dateien benennen und erklären, dass weitere gemeinsame Konfiguration ausdrücklich aus der Ignore-Regel ausgenommen werden muss.

#### Scenario: Maintainerin ergänzt eine gemeinsame Obsidian-Einstellung
- **WHEN** eine Maintainerin eine neue, für alle Leser notwendige Obsidian-Konfiguration hinzufügen will
- **THEN** kann sie anhand der Dokumentation entscheiden, ob sie diese gezielt versioniert statt sie unbeabsichtigt als persönliche Einstellung zu übernehmen
