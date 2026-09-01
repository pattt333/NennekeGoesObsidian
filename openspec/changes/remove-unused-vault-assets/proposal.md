## Why

The generated vault contains two image assets that are not referenced by rulebook content and are not needed by the project. They reappear after conversion because the pipeline copies every image from the ZIP archive.

## What Changes

- Remove the unused generated image assets from the vault.
- Stop the conversion pipeline from copying archive image assets into staging output.
- Ensure applying a regenerated vault removes the obsolete generated asset directory.

## Capabilities

### New Capabilities

- `asset-free-generated-vault`: Keep the generated vault free of unreferenced ZIP image assets.

### Modified Capabilities

- None.

## Impact

- Affected tooling: the Nenneke V2 conversion pipeline and focused tests.
- Affected generated content: `vault/assets/` is removed.

## Validation Impact

- Run pipeline, link, orphan, and strict OpenSpec validation.
