# Workflow Guide

This guide explains our standard workflow for collaborating on the TTRPG rulebook using Obsidian and Git.

---

## Quick Reference

1. **Pull** latest changes
2. **Edit** rules in Obsidian
3. **Commit & Push** your changes
4. **Notify collaborators** about significant changes

---

## Detailed Steps

### Step 1: Pull Latest Changes

Before making any edits, always get the latest version of the vault.

**In Obsidian:**
1. Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac) to open the Command Palette
2. Type **"Obsidian Git: Pull"**
3. Press Enter

**Using Terminal (alternative):**
```bash
cd ~/Documents/NennekeObsidian
git pull
```

**Why this matters:** Pulling first prevents conflicts with changes other people have made.

---

### Step 2: Edit Rules in Obsidian

Now you can safely make your edits.

**Tips for editing:**
- Use **Markdown formatting** for headers, lists, and emphasis
- Use **[[double brackets]]** to link to other notes
- Save frequently (Obsidian auto-saves, but you can press `Ctrl+S` to be sure)
- Keep edits focused - one topic per editing session if possible

**Example Markdown:**
```markdown
# Rule Title

This is a paragraph explaining the rule.

## Subheading

- Bullet point 1
- Bullet point 2

*Italic text* and **bold text** for emphasis.
```

---

### Step 3: Commit & Push Your Changes

When you're done editing, share your changes with the group.

**In Obsidian:**
1. Press `Ctrl+P` or `Cmd+P` to open the Command Palette
2. Type **"Obsidian Git: Commit all changes"**
3. Press Enter
4. Type a short description of what you changed (e.g., "Added surprise round rules")
5. Open the Command Palette again
6. Type **"Obsidian Git: Push"**
7. Press Enter

**Using Terminal (alternative):**
```bash
cd ~/Documents/NennekeObsidian
git add .
git commit -m "Added surprise round rules"
git push
```

**Using the sync script (alternative):**
```bash
cd ~/Documents/NennekeObsidian
./scripts/sync-vault.sh
```
This automatically pulls, commits, and pushes in one step.

**Commit message tips:**
- Keep it short but descriptive
- Start with a verb: "Add", "Update", "Fix", "Remove"
- Examples:
  - "Add initiative rules"
  - "Fix typo in combat section"
  - "Update magic spell descriptions"

---

### Step 4: Notify Collaborators

After pushing your changes, let the group know about significant updates.

Post a message in the Discord channel to let others know what you changed:
> "Hey everyone, I just added rules for surprise rounds in combat. Check out `rules/combat/initiative` for details!"

---

## Best Practices

### Communication
- **Announce** in Discord before editing major sections
- **Pull before you edit** to avoid conflicts
- **Push promptly** after finishing your edits
- **Notify the group** about significant changes

### Organization
- Keep related rules in the same folder
- Use descriptive file names
- Link related notes using `[[wikilinks]]`
- Update the index when adding new sections

### Avoiding Conflicts
- Don't edit the same file at the same time as someone else
- If you see a conflict, ask for help before trying to resolve it
- Make small, focused commits rather than large changes

---

## Troubleshooting

### "Your local changes would be overwritten"
Someone else changed a file you were editing. Options:
1. Stash your changes: `git stash`
2. Pull: `git pull`
3. Restore your changes: `git stash pop`
4. Manually merge if needed

### "Merge conflict"
Two people edited the same lines. Ask for help from someone experienced with Git.

### "Push rejected"
You need to pull first:
1. Pull in Obsidian or run `git pull`
2. Then try pushing again

---

## Need Help?

Reach out on Discord if you have questions. We're all learning together!
