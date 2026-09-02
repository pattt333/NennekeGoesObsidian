## ADDED Requirements

### Requirement: Main-branch PDF build
GitHub Actions SHALL validate the rulebook and build the configured PDF on every push to `main` and on manual dispatch. After a successful push-to-`main` build, the workflow SHALL create a versioned GitHub Release containing the PDF.

#### Scenario: Merge reaches main
- **WHEN** a pull request is merged into `main`
- **THEN** the workflow validates the vault, generates the configured PDF, and publishes the build as the next versioned rulebook release.

#### Scenario: Manual validation build
- **WHEN** a maintainer starts the workflow manually
- **THEN** the workflow validates the vault and generates the configured PDF without creating a tag or GitHub Release.

### Requirement: Downloadable build output
The workflow SHALL upload the generated PDF as a build artifact and, for a successful push to `main`, SHALL attach the same PDF to a GitHub Release. The workflow MUST NOT commit generated binary output back to the repository.

#### Scenario: First automated release
- **WHEN** no final release tag exists and the first successful push-to-`main` build completes
- **THEN** the workflow creates tag `v6.3.1` and publishes a GitHub Release with `Nenneke-v6.3.1.pdf`.

#### Scenario: Later automated release
- **WHEN** a final release tag already exists and a later successful push-to-`main` build completes
- **THEN** the workflow increments the highest tag's patch number, creates that tag for the built commit, and attaches the PDF under the matching versioned filename.

### Requirement: Portable metadata validation
The rulebook metadata validator SHALL accept valid YAML frontmatter using either LF or CRLF line endings.

#### Scenario: CRLF-authored rule note
- **WHEN** an addressable rule note has valid frontmatter separated with CRLF line endings
- **THEN** metadata validation recognizes its ID, title, type, and tags without reporting missing metadata.
