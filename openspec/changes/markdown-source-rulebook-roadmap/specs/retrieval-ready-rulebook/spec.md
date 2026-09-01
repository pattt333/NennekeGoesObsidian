## ADDED Requirements

### Requirement: Provider-neutral retrieval export
The repository SHALL provide a deterministic export of rule records with note ID, title, section heading, canonical link, content, and content hash.

#### Scenario: Future retrieval service indexes the rulebook
- **WHEN** the service consumes the export
- **THEN** it can retrieve and cite source records without accessing repository-specific tooling or API keys.

### Requirement: No retrieval clients in the vault repository
The repository SHALL not contain Discord, Foundry, LLM-provider, embedding, or vector-database integrations.

#### Scenario: Retrieval preparation is completed
- **WHEN** the export contract is available
- **THEN** it remains usable by an external RAG service without adding a bot or game-client dependency here.
