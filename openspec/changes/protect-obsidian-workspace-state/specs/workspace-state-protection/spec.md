## ADDED Requirements

### Requirement: Root workspace state protection
Automated contributors MUST treat an unconfirmed change to the tracked root `.obsidian/workspace.json` as transient agent-generated state, not as a pre-existing user change.

#### Scenario: Agent workflow changes the root workspace state
- **WHEN** an agent finds an unconfirmed diff in `.obsidian/workspace.json`
- **THEN** the agent excludes the file from staging and commits, restores its committed content, and checks Git status before handoff.

#### Scenario: User confirms an intentional workspace change
- **WHEN** the user explicitly states that a root workspace change is intentional
- **THEN** the agent preserves it and handles it only within the user-approved task scope.

### Requirement: Accurate workspace-state handoff
Automated contributors MUST not attribute a root workspace diff to the user without evidence and MUST report the post-cleanup status accurately.

#### Scenario: Cleanup succeeds
- **WHEN** the root workspace state has been restored and Git status no longer reports a diff for it
- **THEN** the agent states that it removed transient agent-generated state.

#### Scenario: Cleanup does not remain clean
- **WHEN** the root workspace state reappears as modified after restoration
- **THEN** the agent reports that condition and does not describe it as a user change.
