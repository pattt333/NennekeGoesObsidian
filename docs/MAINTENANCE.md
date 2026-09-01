# Vault Maintenance Guide

The published vault is derived from `NennekeV2.zip`. Keep rule-content changes source-backed and use the conversion workflow documented in [Nenneke V2 Conversion](NENNEKE_V2_CONVERSION.md) when the archive changes.

## Vault checks

Run these commands from the repository root after changing navigation, converted content, or vault structure:

```bash
npm run nenneke:validate
npm run validate:links
npm run validate:orphans
```

`nenneke:validate` checks the conversion manifest and generated Markdown links. `validate:links` checks Obsidian-style wikilinks. `validate:orphans` starts at `vault/index.md` and `vault/_sidebar.md` and reports source-derived notes that are not reachable from active navigation.

## Previewing the site

Run the Docsify preview when changing reader-facing navigation or presentation:

```bash
npm run serve
```

Open `http://localhost:3000` and verify the home page, sidebar, and affected rule notes.

## Keeping the repository current

- Do not create independent rule notes outside the archive-derived vault content.
- Keep `vault/index.md`, `vault/_sidebar.md`, and `vault/index.html` as the maintained reader entry points.
- Do not restore the retired tag-index feature or historical migration notes; recover prior material from Git history only when a new source-backed decision requires it.
- Before deployment, run the checks above and follow [Deployment Guide](DEPLOYMENT.md).
