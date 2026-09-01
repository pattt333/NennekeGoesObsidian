# Vault Maintenance Guide

The Markdown files in vault/ are the authoritative rulebook source. The former LaTeX archive and conversion pipeline are retired; Git history remains the recovery path for historical material.

## Vault checks

Run these commands from the repository root after changing navigation, converted content, or vault structure:

```bash
npm run validate:links
npm run validate:orphans
npm run validate:metadata
npm run rulebook:test
```

`validate:links` checks Obsidian and relative Markdown links. `validate:orphans` starts at `vault/index.md` and `vault/_sidebar.md` and reports reader-facing notes that are not reachable from active navigation. `validate:metadata` checks stable rule IDs. `rulebook:test` checks the book resolver and RAG-export fixture.

## Previewing the site

Run the Docsify preview when changing reader-facing navigation or presentation:

```bash
npm run serve
```

Open `http://localhost:3000` and verify the home page, sidebar, and affected rule notes.

## Keeping the repository current

- Create and edit rule notes directly in `vault/rules/` and follow the [German authoring guide](MARKDOWN_AUTHORING.md).
- Keep `vault/index.md`, `vault/_sidebar.md`, and `vault/index.html` as the maintained reader entry points.
- Keep the PDF-only include structure under `vault/book/`; it is validated independently and does not belong to Docsify navigation.
- Do not restore conversion sources or migration notes; recover prior material from Git history only when a new editorial decision requires it.
- Before deployment, run the checks above and follow [Deployment Guide](DEPLOYMENT.md).
