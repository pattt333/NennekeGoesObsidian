## Why

Opening or inspecting the vault can update the tracked root Obsidian workspace state automatically. That ephemeral state must never be misidentified as user work or included in an agent handoff.

## What Changes

- Add an explicit `AGENTS.md` safeguard for the root `.obsidian/workspace.json` file.
- Require agents to treat an unconfirmed change to that file as agent-generated state, exclude it from staging and commits, restore it to the committed content, and verify the resulting Git status before handoff.
- Require agents to report that cleanup accurately instead of attributing the file to the user without evidence.

## Capabilities

### New Capabilities

- `workspace-state-protection`: Protect personal root Obsidian workspace state from automatic agent changes and false attribution.

### Modified Capabilities

- None.

## Impact

- Affected documentation: `AGENTS.md`.
- No vault content, Docsify output, dependencies, or scripts change.

## Validation Impact

- Review the documented rule and verify that the working tree remains clean after the scoped documentation commit.
