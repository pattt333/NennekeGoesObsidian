## ADDED Requirements

### Requirement: Declarative PDF scope
The repository SHALL define PDF input order and inclusion in a versioned publication manifest, covering the current core chapters and explicitly selected spells and liturgies.

#### Scenario: Maintainer selects a spell for publication
- **WHEN** the spell is added to the publication manifest
- **THEN** the next PDF build includes it in the configured position without including unrelated spell notes.

#### Scenario: Rule note is not selected
- **WHEN** a spell or liturgy exists in the vault but is absent from the manifest
- **THEN** it remains available in the vault and is excluded from the PDF.
