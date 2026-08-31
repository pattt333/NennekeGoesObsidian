---
name: openspec-archive-change
description: Validate, sync, and archive a completed OpenSpec change.
license: MIT
compatibility: Requires openspec CLI.
metadata:
    author: openspec
    version: '1.0'
    generatedBy: '1.5.0'
---

Select the requested change, inspect it with `openspec status --change "<name>" --json`, and check its tasks for incomplete items. Run `openspec validate "<name>" --strict` before archival. If delta specs exist, use the `openspec-sync-specs` workflow to merge them into `openspec/specs/` first.

Archive only when the required artifacts and tasks are complete, unless the user explicitly approves an exception. Use the OpenSpec CLI archive command and preserve the change metadata. Summarize the archive location and whether specs were synced.
