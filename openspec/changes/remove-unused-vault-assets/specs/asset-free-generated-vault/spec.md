## ADDED Requirements

### Requirement: Asset-free generated vault
The conversion pipeline SHALL not copy ZIP image assets into the generated vault and SHALL remove the generated `vault/assets/` directory when applying staged output.

#### Scenario: Maintainer regenerates and applies the vault
- **WHEN** the maintainer runs the conversion and apply commands
- **THEN** the vault contains no generated image asset directory or unreferenced image files from the ZIP.

#### Scenario: Maintainer validates the generated vault
- **WHEN** the asset-free output is validated
- **THEN** all Markdown links and reachable vault files remain valid.
