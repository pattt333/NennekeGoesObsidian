# Markdown-Source-Baseline

Stand: 2026-09-01

Diese Notiz dokumentiert den letzten überprüften Stand vor der Ablösung der LaTeX-Migration. Ab diesem Commit ist der Inhalt unter `vault/` die maßgebliche Regelwerksquelle; Git-Historie ist die Rückfallmöglichkeit.

## Abgleich der bisherigen Quelle

| Kennzahl | Wert |
| --- | ---: |
| SHA-256 der bisherigen ZIP-Eingabe | `023961bfeb7a020f83876fa4d5e034c26af3c8fe616170b34478c13f7b11e23e` |
| ZIP-Einträge | 667 |
| Nicht-leere konvertierte LaTeX-Dateien | 656 |
| Manifest-Einträge | 660 |
| Davon Regelnotizen | 656 |
| Davon strukturelle Einträge | 4 |
| Regelnotizen im Vault | 660 |
| Redaktionelle Designprinzipien | 9 |

Der Abgleich ergab für jede zuvor konvertierte oder strukturelle Quelldatei eine Markdown-Entsprechung. Die Link- und Erreichbarkeitsprüfungen liefen vor der Promotion erfolgreich.

## Bisheriger PDF-Umfang

Die frühere Publikationsliste umfasste die Grundideen des Regeldesigns sowie Kapitel 1–9 mit 141 eingebundenen Markdown-Notizen. Appendix A, Zauber und Liturgien waren ausgeschlossen.

Der künftige PDF-Umfang wird nicht aus dieser historischen Liste abgeleitet. Er wird in `book.yaml` und der Build-Indexstruktur im Vault explizit gepflegt; ausgewählte Zauber und Liturgien können dort schrittweise ergänzt werden.

## Folgen der Promotion

- `NennekeV2.zip`, die Konvertierungspipeline und ihre Berichte sind keine aktiven Quellen mehr und werden entfernt.
- Bestehende `<!-- Source: ... -->`-Kommentare bleiben als historische Herkunftsnotiz erhalten, begründen aber keine Generierung oder Schreibsperre.
- Regel- und Navigationsänderungen erfolgen direkt in Markdown und werden durch die regulären Vault-Prüfungen abgesichert.
