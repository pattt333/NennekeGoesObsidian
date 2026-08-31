---
name: openspec-apply-change
description: Implement and validate tasks from an OpenSpec change, then automatically commit the task-scoped work.
license: MIT
compatibility: Requires openspec CLI and Git.
metadata:
    author: openspec
    version: '1.0'
    generatedBy: '1.5.0'
---

Select the requested OpenSpec change (or infer it only when unambiguous), then run `openspec status --change "<name>" --json` and `openspec instructions apply --change "<name>" --json`. Read every context file returned by the apply instructions before editing.

Implement pending tasks in order, keeping the work focused. Mark a task complete only after its implementation and required validation succeed. Pause for unclear requirements or design conflicts and update OpenSpec artifacts before continuing.

When all tasks are complete, run `openspec validate "<name>" --strict` plus the task-specific checks. Review `git diff`, stage only files created or modified for this change, and automatically commit them with a concise imperative Conventional Commit message. Never include unrelated pre-existing edits. Report validation results and the commit hash, then suggest `/opsx:archive`.
