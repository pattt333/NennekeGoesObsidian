#!/bin/bash
# backup-vault.sh - Creates a timestamped backup of the Obsidian vault
# This script creates a .tar.gz archive of the entire vault/ directory and stores it in backups/
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
RETENTION_DAYS=30

# Create backups directory if it doesn't exist
if [ ! -d "$BACKUPS_DIR" ]; then
    echo "Creating backups directory..."
    mkdir -p "$BACKUPS_DIR"
fi

# Check if vault directory exists
if [ ! -d "$VAULT_DIR" ]; then
    echo "Error: Vault directory '$VAULT_DIR' not found."
    exit 1
fi

echo "=== Creating vault backup at $(date) ==="

# Pull latest changes to ensure backup is current
echo "Pulling latest changes from remote..."
if ! git pull --ff-only; then
    echo "Warning: git pull failed. Proceeding with backup of current local state."
fi

# Generate timestamped filename (YYYY-MM-DD format as per requirements)
TIMESTAMP=$(date +"%Y-%m-%d")
BACKUP_FILE="$BACKUPS_DIR/vault-backup-$TIMESTAMP.tar.gz"

# If backup already exists for today, add time to avoid overwriting
if [ -f "$BACKUP_FILE" ]; then
    TIMESTAMP=$(date +"%Y-%m-%d_%H%M%S")
    BACKUP_FILE="$BACKUPS_DIR/vault-backup-$TIMESTAMP.tar.gz"
fi

echo "Source: $VAULT_DIR"
echo "Destination: $BACKUP_FILE"

# Create the tar.gz archive
tar -czf "$BACKUP_FILE" "$VAULT_DIR"

echo "Backup created: $BACKUP_FILE"

# Delete backups older than retention period
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUPS_DIR" -name "vault-backup-*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete

echo "=== Backup complete ==="
