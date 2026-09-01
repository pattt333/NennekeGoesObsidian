## Why

The vault still contains migration-era Markdown that is not part of `NennekeV2.zip`, despite the archive being the agreed source of truth. Several contributor documents also describe deleted notes and Discord-based coordination, which makes the published repository harder to trust and maintain.

## What Changes

- Remove all files under `vault/.migration/legacy-markdown/`, including old Schicksalspunkte, Kampfvorteile, spell, initiative, and `08_profanes` material.
- Remove the stale, empty generated tag index at `vault/00-Tag-Index.md`.
- Preserve source-derived rules, source-derived assets, and the required vault entry points (`index.md`, `_sidebar.md`, and `index.html`).
- Remove the obsolete Discord-era contributor workflow document and update remaining repository documentation so it no longer directs readers to deleted paths, Discord, or the retired tag-index output.
- Leave deployment alternatives and their referenced configuration files intact.

## Capabilities

### New Capabilities

- `source-authoritative-vault-cleanup`: Keep published vault content limited to the approved source-derived rulebook and required navigation infrastructure.
- `current-contributor-documentation`: Keep contributor and maintenance documentation aligned with the current vault layout and repository workflow.

### Modified Capabilities

- None.

## Impact

- Affected vault content: `vault/.migration/legacy-markdown/`, `vault/00-Tag-Index.md`, and navigation/health-check assumptions that reference retired files.
- Affected documentation: `docs/WORKFLOW.md`, `docs/MAINTENANCE.md`, `docs/OBSIDIAN_SETUP_GUIDE.md`, and any deployment references that point to retired guidance.
- Affected tooling may include the orphan-check hub list and the tag-index generator if they are no longer needed after the content cleanup.
- Deployment files `docs/Caddyfile` and `docs/nginx.conf` remain supported alternatives and are not candidates for removal.

## Validation Impact

- Run `npm run validate:links` and `npm run validate:orphans` after retiring vault files and adjusting navigation assumptions.
- Preview the Docsify entry page and chapter navigation to confirm that the public rulebook remains readable without retired notes.
- Review repository-wide references to deleted paths and Discord guidance before committing the scoped cleanup.
