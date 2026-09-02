## ADDED Requirements

### Requirement: Einheitliche Grundbegriffe und Kampfreferenzen

Das Regelwerk MUST freie Reaktionen eindeutig von freien Aktionen
unterscheiden und darf keine veralteten Kampfmanöver, Vorteile oder
Waffenmeister-Baukastenregeln als aktuell darstellen.

#### Scenario: Freie Reaktion wird verwendet

- **WHEN** eine Regel eine freie Reaktion verleiht
- **THEN** verursacht sie keinen Malus für mehrfache Reaktionen
- **AND THEN** erhöht sie keinen Malus für spätere Reaktionen

#### Scenario: Kampfregel verweist auf eine Voraussetzung

- **WHEN** ein Manöver oder Kampfstil eine Voraussetzung oder Wirkung nennt
- **THEN** verwendet es einen im aktuellen Regelwerk vorhandenen Vorteil oder
  die in der zugehörigen Tabelle definierte Wirkung

### Requirement: Konsistente Stack-, Energie- und Heilregeln

Das Regelwerk MUST Erschöpfung, Energie-Regeneration und Heilung für Blutung,
Gift und Krankheit ohne widersprüchliche Werte oder Wirkungen beschreiben.

#### Scenario: Ein Charakter besitzt Erschöpfung

- **WHEN** ein Charakter einen Stack Erschöpfung besitzt
- **THEN** erhält er pro Stack einen Malus von −2 auf alle Proben

#### Scenario: Energie regeneriert während einer Rast

- **WHEN** ein Charakter Energie regeneriert
- **THEN** gilt der Regenerationswert seines jeweiligen Energievorteils

#### Scenario: Heilkunde gegen anhaltende Zustände gelingt

- **WHEN** eine erfolgreiche Heilkundeprobe gegen Blutung, Gift oder Krankheit
  ausgeführt wird
- **THEN** entfernt sie einen Stack des jeweiligen Zustands
