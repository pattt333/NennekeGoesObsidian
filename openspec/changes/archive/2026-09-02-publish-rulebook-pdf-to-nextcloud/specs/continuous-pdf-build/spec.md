## ADDED Requirements

### Requirement: Current PDF in Nextcloud
After a successful automated `main`-branch rulebook release, the workflow SHALL upload the same generated PDF to the configured Nextcloud WebDAV folder as `Nenneke.pdf`. The workflow MUST obtain the WebDAV URL, username, and app password only from GitHub Actions Secrets.

#### Scenario: Successful release upload
- **WHEN** a push-to-`main` build and GitHub Release succeed
- **THEN** the configured Nextcloud folder contains the release PDF as `Nenneke.pdf`.

#### Scenario: Manual build
- **WHEN** a maintainer starts the workflow manually
- **THEN** the workflow does not access Nextcloud or upload a PDF.
