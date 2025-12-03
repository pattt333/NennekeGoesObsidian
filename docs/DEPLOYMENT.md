# Deployment Guide

This document contains instructions for deploying and maintaining the NennekeObsidian vault on a server.

## Automated Backup System

The vault includes an automated backup system that creates timestamped, compressed archives to prevent data loss.

### Backup Script

The backup script is located at `scripts/backup-vault.sh`. It performs the following operations:

1. Pulls the latest changes from the remote repository (`git pull`)
2. Creates a compressed archive (`backups/vault-backup-YYYY-MM-DD.tar.gz`)
3. Automatically deletes backups older than 30 days

### Setting Up the Cron Job

To configure the backup script to run automatically every day at 2 AM:

1. Ensure the script is executable:
   ```bash
   chmod +x /path/to/NennekeObsidian/scripts/backup-vault.sh
   ```

2. Open the crontab editor:
   ```bash
   crontab -e
   ```

3. Add the following line to schedule the backup at 2 AM daily:
   ```
   0 2 * * * /path/to/NennekeObsidian/scripts/backup-vault.sh >> /var/log/vault-backup.log 2>&1
   ```

   Replace `/path/to/NennekeObsidian` with the actual path to your repository.

4. Save and exit the editor.

### Verifying the Cron Job

To verify that the cron job is set up correctly:

```bash
crontab -l
```

This will list all scheduled cron jobs for the current user.

### Manual Backup

To run a backup manually:

```bash
cd /path/to/NennekeObsidian
./scripts/backup-vault.sh
```

### Backup Storage

Backups are stored in the `backups/` directory at the repository root. This directory is excluded from version control via `.gitignore`.

### Restoring from Backup

To restore the vault from a backup:

1. Navigate to the repository root:
   ```bash
   cd /path/to/NennekeObsidian
   ```

2. Extract the backup archive:
   ```bash
   tar -xzf backups/vault-backup-YYYY-MM-DD.tar.gz
   ```

   This will restore the `vault/` directory from the backup.
