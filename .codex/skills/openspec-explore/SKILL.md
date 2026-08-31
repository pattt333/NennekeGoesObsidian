---
name: openspec-explore
description: Explore an idea or problem without implementation. Use before creating an OpenSpec change or when a change needs more investigation.
license: MIT
compatibility: Requires openspec CLI.
metadata:
    author: openspec
    version: '1.0'
    generatedBy: '1.5.0'
---

Explore the request as a thinking partner. You may inspect the repository, active OpenSpec changes, Markdown structure, links, and scripts, but you must not implement product changes in this mode.

Start with `openspec list --json`. If a relevant change exists, use `openspec status --change "<name>" --json` and read its completed artifacts. Surface content, link, navigation, deployment, and validation implications. When the work is clear, offer to create or update an OpenSpec proposal; do not create artifacts without the user's direction.

When the user names an OpenSpec store, use `openspec store list --json` and pass the selected `--store` option to commands that support it.
