## Why

The repository root contains uncommitted artifacts left over from conversion work and an unrelated Foundry planning file. These make the working tree noisy and can obscure meaningful vault changes, while the authoritative LaTeX ZIP must remain available for reproducible conversion.

## What Changes

- Remove the untracked `NennekeV6_3_1.pdf` visual-reference copy, the empty `Unbenannt.canvas`, the unrelated Foundry restructuring plan, and generated Python bytecode caches.
- Keep `NennekeV2.zip` at the repository root because the conversion pipeline reads it as its authoritative, checksum-recorded input.
- Update conversion documentation so it records the completed V6.3.1 visual comparison without requiring the removed local reference PDF.
- Add an ignore rule for Python bytecode caches so routine validation does not recreate untracked clutter.
- Leave personal `.obsidian` state and content-equivalent, line-ending-only vault status entries untouched and excluded from the commit.

## Capabilities

### New Capabilities

- `repository-artifact-hygiene`: The repository keeps only required conversion inputs and maintained project artifacts in its working tree, while personal and generated local state remains excluded.

### Modified Capabilities

- None.

## Impact

- Affected root artifacts: `NennekeV6_3_1.pdf`, `Unbenannt.canvas`, and `feature-based_folder_restructure_8fbdef97.plan.md` are removed; `NennekeV2.zip` is retained.
- Affected generated artifacts: `scripts/__pycache__/` is removed and future caches are ignored.
- Affected documentation: `docs/NENNEKE_V2_CONVERSION.md` no longer implies that the historical comparison PDF must remain in the repository.
- No vault Markdown, wikilinks, sidebar navigation, Docsify presentation, deployment configuration, or conversion output is changed.

## Validation Impact

- Run `npm run validate:links` after the maintained Markdown documentation change.
- Verify that the conversion inventory still identifies the retained ZIP and that the conversion commands continue to find it.
- Review the scoped diff to confirm personal Obsidian state and unrelated content-equivalent vault worktree entries remain unstaged.
