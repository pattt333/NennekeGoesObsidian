---
name: openspec-propose
description: Create an OpenSpec change proposal, design, delta specs, and tasks for a significant change.
license: MIT
compatibility: Requires openspec CLI.
metadata:
    author: openspec
    version: '1.0'
    generatedBy: '1.5.0'
---

Create a new OpenSpec change from the user's request. Derive a concise kebab-case name if needed, then run `openspec new change "<name>"` and inspect `openspec status --change "<name>" --json`.

Create every artifact required for apply in dependency order. For each ready artifact, run `openspec instructions <artifact-id> --change "<name>" --json`, read completed dependencies, use the supplied template, and write the artifact to its resolved path. Follow `openspec/config.yaml`; do not copy its context or rules into artifacts. Recheck status after each artifact and finish with `openspec status --change "<name>"`.

For content changes, explicitly cover wikilinks, navigation, and the appropriate validation commands. Include a final automatic-commit task after validation succeeds. Do not include end-to-end-test tasks.
