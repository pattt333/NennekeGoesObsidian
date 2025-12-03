# Vault Maintenance Guide

This document describes the maintenance scripts available for keeping the shared Obsidian vault organized and functional.

---

## Overview

The vault includes three maintenance scripts located in the `scripts/` directory:

| Script | Purpose |
|--------|---------|
| `vault-health-check.js` | Finds broken Markdown links |
| `find-orphaned-files.js` | Identifies files not linked from hub files |
| `create-tag-index.js` | Generates a tag index from all files |

All scripts are written in Node.js and require no external dependencies.

---

## vault-health-check.js

Scans all Markdown files in the vault and identifies broken Obsidian-style wiki links (`[[...]]`).

### Usage

```bash
cd /path/to/NennekeObsidian
node scripts/vault-health-check.js
```

### What It Checks

- Scans all `.md` files in the `vault/` directory (excluding hidden folders)
- Identifies wiki links in the format `[[link]]` or `[[link|display text]]`
- Validates that each link target exists as a file or directory
- Supports heading anchors (e.g., `[[file#heading]]`)

### Output

The script outputs:
- Total number of links scanned
- Number of broken links found
- For each broken link: file location, line number, and the broken link text

### Example Output

```
=== Vault Health Check ===

Scanning vault at: /path/to/NennekeObsidian/vault

Found 15 Markdown files

=== Report ===

Total links scanned: 42
Broken links found: 2

Broken Links:

📄 rules/combat/initiative.md
   Line 35: [[../../index]]

📄 notes/session-1.md
   Line 12: [[characters/missing-npc]]
```

### Exit Codes

- `0`: No broken links found
- `1`: Broken links found or error occurred

---

## find-orphaned-files.js

Identifies Markdown files that are not reachable from the main hub files (`index.md`, `_sidebar.md`, `README.md`).

### Usage

```bash
cd /path/to/NennekeObsidian
node scripts/find-orphaned-files.js
```

### How It Works

1. Starts from hub files: `index.md`, `_sidebar.md`, and `README.md`
2. Traverses all links (both wiki links `[[...]]` and standard Markdown links `[text](url)`)
3. Builds a graph of connected files
4. Reports any files that cannot be reached from the hub files

### Output

The script outputs:
- Total number of files
- Number of reachable files
- Number of orphaned files
- List of orphaned files grouped by directory

### Example Output

```
=== Find Orphaned Files ===

Scanning vault at: /path/to/NennekeObsidian/vault

Found 20 Markdown files

Hub files: index.md, _sidebar.md, README.md

=== Report ===

Total files: 20
Reachable files: 18
Orphaned files: 2

Orphaned Files (not linked from hub files):

📁 notes
   - draft-ideas.md
   - old-session-notes.md

Suggestion: Consider linking these files from index.md or other hub files,
or remove them if they are no longer needed.
```

### Exit Codes

- `0`: No orphaned files found
- `1`: Orphaned files found or error occurred

---

## create-tag-index.js

Scans all Markdown files for hashtags and generates a summary index file at `vault/00-Tag-Index.md`.

### Usage

```bash
cd /path/to/NennekeObsidian
node scripts/create-tag-index.js
```

### How It Works

1. Scans all `.md` files in the vault
2. Extracts hashtags (e.g., `#combat`, `#magic`, `#npc`)
3. Ignores tags inside code blocks
4. Generates an alphabetically organized index with links to each file

### Tag Format

Valid tags are hashtags that:
- Start with a letter (not a number)
- Contain letters, numbers, underscores, or hyphens
- Are not inside code blocks (inline or fenced)

Examples of valid tags: `#combat`, `#session-1`, `#important_note`

### Output File

The generated `00-Tag-Index.md` includes:
- A quick navigation section with letter links
- Tags organized alphabetically by first letter
- Links to all files containing each tag
- Statistics about tag usage

### Example Output

```
=== Create Tag Index ===

Scanning vault at: /path/to/NennekeObsidian/vault

Found 15 Markdown files

Found 8 unique tags
Total tag usages: 24

✅ Tag index generated at: vault/00-Tag-Index.md

Most used tags:
  #combat: 5 file(s)
  #rules: 4 file(s)
  #magic: 3 file(s)
```

### Exit Codes

- `0`: Index generated successfully
- `1`: Error occurred

---

## Running All Scripts

To perform a complete vault health check, run all three scripts:

```bash
cd /path/to/NennekeObsidian

# Check for broken links
node scripts/vault-health-check.js

# Find orphaned files
node scripts/find-orphaned-files.js

# Generate tag index
node scripts/create-tag-index.js
```

### Recommended Schedule

- **Before major edits**: Run `vault-health-check.js` to ensure link integrity
- **Weekly**: Run `find-orphaned-files.js` to identify stale content
- **After adding new content**: Run `create-tag-index.js` to update the tag index

---

## Troubleshooting

### Scripts not finding the vault

Ensure you are running the scripts from the repository root directory, or that the `vault/` directory exists at the expected location.

### Permission errors

Make the scripts executable (optional, since you can run them with `node`):

```bash
chmod +x scripts/vault-health-check.js
chmod +x scripts/find-orphaned-files.js
chmod +x scripts/create-tag-index.js
```

### False positives in broken links

Some links may be intentionally broken (e.g., placeholders for future content). Review the output carefully before taking action.
