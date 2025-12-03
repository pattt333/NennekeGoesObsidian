#!/bin/bash
# backup-vault.sh - Creates a timestamped backup of the Obsidian vault
# This script creates a .zip archive of the entire vault/ directory and stores it in backups/
# Usage: ./backup-vault.sh

# Exit on error
set -e

# Navigate to the repository root (parent of scripts folder)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$REPO_ROOT"

# Define paths
VAULT_DIR="vault"
BACKUPS_DIR="backups"

# Create backups directory if it doesn't exist
if [ ! -d "$BACKUPS_DIR" ]; then
    echo "Creating backups directory..."
    mkdir -p "$BACKUPS_DIR"
fi

# Generate timestamped filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUPS_DIR/vault_backup_$TIMESTAMP.zip"

# Check if vault directory exists
if [ ! -d "$VAULT_DIR" ]; then
    echo "Error: Vault directory '$VAULT_DIR' not found."
    exit 1
fi

echo "=== Creating vault backup at $(date) ==="
echo "Source: $VAULT_DIR"
echo "Destination: $BACKUP_FILE"

# Create the zip archive
zip -r "$BACKUP_FILE" "$VAULT_DIR"

echo "=== Backup complete: $BACKUP_FILE ==="
