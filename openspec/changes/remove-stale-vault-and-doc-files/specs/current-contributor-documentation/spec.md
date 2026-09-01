## ADDED Requirements

### Requirement: Current contributor guidance
Contributor and maintenance documentation SHALL describe the current source-derived vault and supported repository workflow without referring readers to Discord, obsolete notes, or the retired tag-index feature.

#### Scenario: Read contributor guidance
- **WHEN** a contributor reads the maintained setup and maintenance documents
- **THEN** they are not directed to Discord, `rules/combat/initiative`, `rules/02_Schicksalspunkte`, `notes/`, or `create-tag-index.js`

### Requirement: Supported deployment documentation remains available
The repository SHALL retain the current deployment guide and both documented web-server configuration alternatives.

#### Scenario: Choose a deployment server
- **WHEN** a maintainer follows the deployment guide
- **THEN** both the Caddy and nginx configuration paths remain documented and available
