## Context

The repository tracks the root `.obsidian/workspace.json`, but that file records transient UI details such as recently opened files. Agent work can therefore alter it without a deliberate edit. The existing guidance says to keep personal workspace files out of commits but does not define attribution or cleanup when this specific tracked file changes.

## Goals / Non-Goals

**Goals:**

- Give agents an unambiguous procedure for unconfirmed root workspace changes.
- Preserve intentional user changes when the user explicitly confirms them.
- Keep automatic commits free of transient root workspace state.

**Non-Goals:**

- Stop Obsidian from updating its workspace state.
- Untrack, delete, or ignore the root `.obsidian/workspace.json` file.
- Change vault-local Obsidian configuration or reader behavior.

## Decisions

- Add a targeted rule to `AGENTS.md` rather than changing the Git ignore rules. The file remains tracked, while agent behavior becomes explicit and auditable.
- Treat a root workspace diff as agent-generated unless the user confirms ownership. This avoids unsupported attribution while still allowing user-directed changes.
- Require restoration to the committed content and a final Git-status check before handoff. This removes transient content and confirms that any remaining state is not silently left behind.

## Risks / Trade-offs

- [An unconfirmed user edit could be reverted] → Agents MUST ask before restoring when there is evidence that the user intentionally edited the file or when its ownership is unclear.
- [Obsidian can update the file again after restoration] → Agents MUST re-check Git status and report the state accurately rather than assuming cleanup succeeded.
