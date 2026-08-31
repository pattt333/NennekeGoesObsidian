---
name: openspec-sync-specs
description: Merge OpenSpec delta specifications from an active change into the main specifications.
license: MIT
compatibility: Requires openspec CLI.
metadata:
    author: openspec
    version: '1.0'
    generatedBy: '1.5.0'
---

Select the requested change and run `openspec status --change "<name>" --json`. Use the returned delta-spec paths, read each delta and the corresponding `openspec/specs/<capability>/spec.md`, and merge ADDED, MODIFIED, REMOVED, and RENAMED requirements intelligently.

Preserve main-spec content not covered by the delta. Create a main capability spec when the delta introduces one. The operation must be idempotent. Summarize every capability and requirement changed; the change remains active until archived.
