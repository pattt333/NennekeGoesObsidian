# Discord Bot Cheatsheet

Our Discord bot helps you interact with the TTRPG rulebook directly from Discord. Here are all the available commands.

---

## Commands Overview

| Command | Description |
|---------|-------------|
| `!rules sync` | Pull the latest changes from the vault |
| `!rules status` | Show the last 5 commits |
| `!rules find <path>` | Display the content of a rule file |

---

## Command Details

### !rules sync

**What it does:** Pulls the latest changes from the GitHub repository to keep the bot's copy of the vault up to date.

**When to use:** When you want to make sure the bot has the most recent version of the rules.

**Example:**
```
!rules sync
```

**Bot response:**
```
Syncing vault with remote...
Sync complete:
Already up to date.
```

---

### !rules status

**What it does:** Shows the last 5 commits (changes) made to the vault.

**When to use:** When you want to see what changes have been made recently and who made them.

**Example:**
```
!rules status
```

**Bot response:**
```
Last 5 commits:
abc1234 Add new combat rules
def5678 Update magic spell list
ghi9012 Fix typo in initiative
jkl3456 Add character sheet template
mno7890 Initial vault setup
```

---

### !rules find

**What it does:** Displays the content of a specific rule file from the vault.

**When to use:** When you need to quickly look up a rule during a session without leaving Discord.

**How to use:** Provide the file path relative to the vault folder. You don't need to include the `.md` extension.

**Example 1 - Basic usage:**
```
!rules find rules/combat/initiative
```

**Bot response:**
```md
# Initiative

Initiative determines the order in which characters and creatures act during combat.
...
```

**Example 2 - With .md extension (also works):**
```
!rules find rules/combat/initiative.md
```

**Example 3 - No file path (shows usage):**
```
!rules find
```

**Bot response:**
```
Usage: !rules find <file-path>
Example: !rules find rules/combat/initiative
```

---

## Tips

1. **File paths are case-sensitive** - Make sure you type the path exactly as it appears in the vault.

2. **Use forward slashes** - Use `/` to separate folders, even on Windows.

3. **Long files are paginated** - If a rule file is very long, the bot will split it into multiple messages.

4. **Sync before searching** - If you recently pushed changes, run `!rules sync` first to make sure the bot has the latest version.

---

## Common File Paths

Here are some commonly used file paths in our vault:

| Description | Path |
|-------------|------|
| Combat initiative rules | `rules/combat/initiative` |
| Main vault index | `index` |

*Ask the group for more commonly used paths and update this list!*

---

## Need Help?

If a command isn't working or you need help finding a file, ask in the Discord channel and someone will help you out.
