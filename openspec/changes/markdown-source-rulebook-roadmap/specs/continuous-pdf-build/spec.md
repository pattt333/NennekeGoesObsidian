## ADDED Requirements

### Requirement: Main-branch PDF build
GitHub Actions SHALL validate the rulebook and build the configured PDF on every push to `main` and on manual dispatch.

#### Scenario: Merge reaches main
- **WHEN** a pull request is merged into `main`
- **THEN** the workflow validates the vault and generates the configured PDF.

### Requirement: Downloadable build output
The workflow SHALL upload the generated PDF as a build artifact without committing generated binary output back to the repository or creating a release.

#### Scenario: Workflow build succeeds
- **WHEN** the PDF build completes successfully
- **THEN** maintainers can download the generated PDF from the workflow run.
