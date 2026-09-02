## Context

Der lesbare Obsidian-Vault liegt unter `vault/`; die frühere Root-Obsidian-Konfiguration ist daher kein gemeinsamer Bestandteil des Regelbuchs. Im aktuellen Index sind jedoch sowohl fünf Root-Dateien als auch drei Vault-Dateien aus `.obsidian/` verfolgt. Nur die Vault-`appearance.json` aktiviert die gemeinsam gewünschte Tabellenformatierung, und nur das zugehörige CSS-Snippet liefert diese Darstellung.

Git-Ignore-Regeln wirken nicht auf bereits verfolgte Dateien. Damit der Arbeitsstand künftig ruhig bleibt, müssen die nicht gemeinsamen Dateien sowohl aus dem Index entfernt als auch für künftige lokale Erzeugung ignoriert werden.

## Goals / Non-Goals

**Goals:**

- Neue und bestehende Klone erhalten die aktivierte Segmenttabellen-Darstellung ohne persönliche Obsidian-Sitzungsdaten.
- Obsidian kann lokale Arbeitsbereiche und Kern-Plugin-Einstellungen erzeugen, ohne sie als Git-Änderungen anzuzeigen oder bei gewöhnlichem Staging aufzunehmen.
- Die Reduktion verändert keine Markdown-Inhalte, Wikilinks, Docsify-Navigation oder PDF-Erzeugung.

**Non-Goals:**

- Keine Umschreibung, Löschung oder sonstige Bereinigung bereits bestehender Git-Historie.
- Keine Entfernung oder Ignorierung von `.canvas`- oder `.base`-Dateien; sie können absichtliche Vault-Inhalte sein.
- Keine erzwungene Theme-, Plugin- oder Workspace-Konfiguration für einzelne Leserinnen und Leser.

## Decisions

### Genau zwei Vault-Dateien bleiben gemeinsamer Standard

Versioniert bleiben ausschließlich `vault/.obsidian/appearance.json` und `vault/.obsidian/snippets/health-segment-tables.css`. Sie bilden zusammen eine verständliche, minimale gemeinsame Darstellung: Die eine Datei aktiviert das Snippet, die andere definiert es.

Alternative: Die gesamte Vault-`.obsidian`-Konfiguration zu teilen. Das würde automatisch aktualisierte Kern-Plugin- und App-Zustände wieder als Git-Diffs einführen, ohne einen notwendigen Regelbuchnutzen zu liefern.

### Nicht gemeinsame Dateien werden ungetrackt und ignoriert

Die Root-`.obsidian`-Dateien sowie `vault/.obsidian/app.json` und `vault/.obsidian/core-plugins.json` werden aus dem Git-Index entfernt, jedoch nicht durch den Change physisch gelöscht. Präzise Ignore-Regeln decken diese Dateien und üblichen persönlichen Vault-Zustand ab. Die Ausnahmen für die zwei gemeinsamen Dateien bleiben ausdrücklich sichtbar.

Alternative: Nur Ignore-Regeln ergänzen. Das schützt bereits verfolgte Dateien nicht; sie würden weiterhin bei jeder Obsidian-Nutzung als Änderungen erscheinen.

### Bestehende Historie bleibt unverändert

Die Bereinigung gilt ab dem aktuellen Commit. Vergangene Commits bleiben als nachvollziehbare Entwicklung erhalten; es gibt keinen Force-Push und keine Beeinträchtigung bestehender Klone oder Referenzen.

Alternative: History-Rewrite mit einem Git-Filter. Dieser wäre nur für einen zwingenden Datenschutz- oder Geheimnisfall angemessen, würde alle Commit-Hashes ändern und die Zusammenarbeit unnötig stören.

## Risks / Trade-offs

- [Lokale Konfigurationsdateien bleiben auf bestehenden Rechnern liegen] → Sie werden durch `.gitignore` unsichtbar für Git; neue Klone erhalten sie bei Bedarf automatisch von Obsidian.
- [Eine spätere gemeinsame Obsidian-Einstellung wird versehentlich ignoriert] → Die Dokumentation nennt die zwei bewusst versionierten Dateien und erklärt, dass neue gemeinsame Konfiguration gezielt aus der Ignore-Regel ausgenommen werden muss.
- [Manuelles `git add -f` kann Ignorierregeln umgehen] → Der normale Arbeitsablauf und die Agentenregeln schließen persönliche Obsidian-Dateien weiterhin aus; ein Force-Add bleibt eine bewusste Ausnahme.

## Content and Link Impact

Es werden keine Markdown-Dateien, Wikilinks, Navigationsdateien oder Buch-Includes verschoben, umbenannt oder entfernt. Die Dokumentation erhält nur Pflegehinweise für die Konfiguration. Redirects und Linkmigrationen sind nicht erforderlich.

## Migration Plan

1. Ignore-Regeln für Root- und persönliche Vault-Konfiguration ergänzen und die beiden gemeinsamen Dateien ausdrücklich ausnehmen.
2. Die überflüssigen, bereits verfolgten Obsidian-Dateien aus dem Index entfernen, ohne lokale Kopien zu löschen.
3. Dokumentieren, dass `appearance.json` und das Snippet die einzigen gemeinsamen Obsidian-Dateien sind.
4. Ignore-Verhalten, den verbleibenden Git-Index und die unveränderte Regelbuchnavigation prüfen.

Rollback: Die entfernten Dateien sind in der bisherigen Historie verfügbar und können bei einem nachgewiesenen gemeinsamen Bedarf wieder gezielt versioniert werden.

## Validation Strategy

- `git check-ignore --no-index` prüft repräsentative persönliche Obsidian-Dateien.
- `git ls-files` prüft, dass nur die zwei vorgesehenen Vault-Dateien und keine Root-`.obsidian`-Datei verfolgt werden.
- Die JSON-Syntax der verbleibenden `appearance.json` wird geprüft.
- `npm run validate:links` prüft die deutschsprachige Dokumentationsänderung und die unveränderte Vault-Navigation.
- Der Arbeitsstand wird vor dem Commit kontrolliert, damit vorhandene Nutzeränderungen, Canvas- oder Base-Dateien nicht gestagt werden.
