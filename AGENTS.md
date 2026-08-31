# AGENTS.md — NennekeObsidian

This file defines the shared workflow for AI agents and other automated contributors working in this repository.

## Project context

NennekeObsidian is a shared Obsidian vault for a TTRPG rulebook, published as a static Docsify site. Content lives in `vault/`; utility scripts live in `scripts/`; server and contributor documentation lives in `docs/`.

- Preserve the existing language and terminology in the file being edited.
- Prefer focused Markdown changes and valid Obsidian wikilinks.
- Keep generated or personal Obsidian workspace files out of task commits unless the task explicitly requires them.

## OpenSpec workflow

Use OpenSpec for every significant content, tooling, workflow, or documentation change.

```text
Explore → Propose → Apply → Archive
```

1. **Explore** — investigate and clarify; do not implement.
2. **Propose** — create `proposal.md`, `design.md`, delta `specs/`, and `tasks.md`.
3. **Apply** — implement and check off the tasks.
4. **Archive** — sync delta specs to `openspec/specs/`, then archive the completed change.

```bash
openspec list --json
openspec new change "<change-name>"
openspec status --change "<change-name>" --json
openspec instructions <artifact-id> --change "<change-name>" --json
openspec instructions apply --change "<change-name>" --json
openspec validate --change "<change-name>"
```

The configuration is in `openspec/config.yaml`. The workflow commands are `/opsx:explore`, `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, and `/opsx:archive`.

Small, mechanical edits such as correcting a clear typo may skip OpenSpec. Do not begin implementation until the proposal artifacts required by the schema are complete.

## Validation

Choose checks that match the change:

- Markdown content, links, or navigation: `npm run validate:links`
- New or moved vault content: `npm run validate:orphans`
- Docsify output or layout: preview with `npm run serve` and inspect the relevant page
- Script changes: run the affected script with a representative input

Do not add or require end-to-end testing unless the project later adopts it explicitly.

## Git handoff and automatic commits

After validation succeeds, review the diff and automatically commit every change made by the agent for the current task. Do not stage or commit pre-existing, unrelated user changes. Use a concise imperative Conventional Commit message, for example `docs: reorganize combat rules` or `chore: add OpenSpec workflow`.

Do not commit if required validation fails or has not been run. Report the validation result and commit hash in the handoff.
