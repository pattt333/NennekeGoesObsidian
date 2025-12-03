#!/bin/bash
# sync-vault.sh - Automates git sync for the Obsidian vault
# This script safely runs git pull, stages all changes, commits with a timestamp, and pushes.
# Usage: ./sync-vault.sh

# Exit on error
set -e

# Navigate to the repository root (parent of scripts folder)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

echo "=== Syncing vault at $(date) ==="

# Pull latest changes from remote (fast-forward only for safety)
echo "Pulling latest changes..."
git pull --ff-only

# Stage all changes
echo "Staging changes..."
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "No changes to commit."
else
    # Commit with timestamp
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    echo "Committing changes with timestamp: $TIMESTAMP"
    git commit -m "Auto-sync: $TIMESTAMP"

    # Push changes to remote
    echo "Pushing changes..."
    git push
fi

echo "=== Sync complete ==="
