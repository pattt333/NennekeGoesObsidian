# Deployment Guide

This document provides complete instructions for deploying the NennekeObsidian system (Discord Bot + Web View) on your personal server.

---

## Table of Contents

1. [Server Setup](#1-server-setup)
2. [Discord Bot](#2-discord-bot)
3. [Web View](#3-web-view)
4. [Cron Jobs](#4-cron-jobs)

---

## 1. Server Setup

This section covers the initial server configuration, including cloning the repository and installing required dependencies.

### Prerequisites

- A Linux server (Ubuntu 20.04+ or Debian 11+ recommended)
- Root or sudo access
- A domain or subdomain pointing to your server (for HTTPS)

### 1.1 Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Git

```bash
sudo apt install -y git
```

Verify the installation:

```bash
git --version
```

### 1.3 Install Node.js

Install Node.js 18.x or later using the NodeSource repository:

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify the installation:

```bash
node --version
npm --version
```

### 1.4 Install Pandoc (Optional)

Pandoc is useful for converting documents between formats (e.g., LaTeX to Markdown):

```bash
sudo apt install -y pandoc
```

Verify the installation:

```bash
pandoc --version
```

### 1.5 Clone the Repository

Choose an installation directory (we recommend `/opt`):

```bash
cd /opt
sudo git clone https://github.com/pattt333/NennekeObsidian.git
sudo chown -R $USER:$USER NennekeObsidian
cd NennekeObsidian
```

### 1.6 Create a Dedicated User (Recommended)

For security, create a dedicated user to run the services:

```bash
sudo useradd -r -s /bin/false nenneke
sudo chown -R nenneke:nenneke /opt/NennekeObsidian
```

---

## 2. Discord Bot

This section covers setting up the Discord bot, including creating the Discord application, configuring environment variables, and running the bot as a persistent service.

### 2.1 Create a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click **"New Application"** and give it a name (e.g., "Nenneke Rules Bot")
3. Navigate to the **"Bot"** section in the left sidebar
4. Click **"Add Bot"** and confirm
5. Under **"Privileged Gateway Intents"**, enable:
   - **Message Content Intent** (required for reading message content)
6. Click **"Reset Token"** to generate a new token and copy it securely

### 2.2 Invite the Bot to Your Server

1. Navigate to the **"OAuth2"** section, then **"URL Generator"**
2. Under **"Scopes"**, select:
   - `bot`
3. Under **"Bot Permissions"**, select:
   - `Send Messages`
   - `Read Message History`
   - `Add Reactions`
4. Copy the generated URL and open it in your browser to invite the bot to your server

### 2.3 Configure Environment Variables

Navigate to the bot directory and create the `.env` file:

```bash
cd /opt/NennekeObsidian/discord-bot
cp .env.example .env
```

Edit the `.env` file and add your Discord bot token:

```bash
nano .env
```

```env
DISCORD_TOKEN=your_actual_discord_bot_token_here
```

**Important:** Keep your token secret. Never commit it to version control.

### 2.4 Install Dependencies

```bash
cd /opt/NennekeObsidian/discord-bot
npm install
```

### 2.5 Test the Bot

Run the bot manually to verify it works:

```bash
node bot.js
```

You should see `Logged in as YourBot#1234`. Test the bot commands in Discord (`!rules help`), then press `Ctrl+C` to stop.

### 2.6 Running as a Service

Choose one of the following methods to run the bot as a persistent service:

#### Option A: Using PM2 (Recommended)

PM2 is a production process manager for Node.js applications.

1. Install PM2 globally:

   ```bash
   sudo npm install -g pm2
   ```

2. Start the bot using the provided PM2 configuration:

   ```bash
   cd /opt/NennekeObsidian/discord-bot
   mkdir -p logs
   pm2 start pm2.config.js
   ```

3. Save the PM2 process list and configure startup:

   ```bash
   pm2 save
   pm2 startup
   ```

   Follow the instructions printed by `pm2 startup` to enable auto-start on boot.

4. Useful PM2 commands:

   ```bash
   pm2 status              # View running processes
   pm2 logs nenneke-discord-bot  # View logs
   pm2 restart nenneke-discord-bot  # Restart the bot
   pm2 stop nenneke-discord-bot     # Stop the bot
   ```

#### Option B: Using systemd

systemd is the standard service manager on most Linux distributions.

1. Copy the service file to the systemd directory:

   ```bash
   sudo cp /opt/NennekeObsidian/discord-bot/discord-bot.service /etc/systemd/system/
   ```

2. If using a different user or path, edit the service file:

   ```bash
   sudo nano /etc/systemd/system/discord-bot.service
   ```

   Update `User`, `WorkingDirectory`, and `EnvironmentFile` paths as needed.

3. Reload systemd and enable the service:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable discord-bot
   sudo systemctl start discord-bot
   ```

4. Useful systemd commands:

   ```bash
   sudo systemctl status discord-bot   # View status
   sudo journalctl -u discord-bot -f   # View logs (follow mode)
   sudo systemctl restart discord-bot  # Restart the bot
   sudo systemctl stop discord-bot     # Stop the bot
   ```

---

## 3. Web View

This section covers serving the Obsidian vault as a static website using Docsify and a reverse proxy.

### 3.1 Install Docsify CLI (Optional)

Docsify CLI is useful for local development and testing:

```bash
sudo npm install -g docsify-cli
```

Test locally:

```bash
cd /opt/NennekeObsidian
docsify serve ./vault
```

Open `http://localhost:3000` in your browser.

### 3.2 Set Up a Reverse Proxy

For production, use a web server to serve the vault directory. Choose one of the following options:

#### Option A: Using Caddy (Recommended)

Caddy automatically handles HTTPS certificates via Let's Encrypt.

1. Install Caddy:

   ```bash
   sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
   sudo apt update
   sudo apt install caddy
   ```

2. Copy and configure the Caddyfile:

   ```bash
   sudo cp /opt/NennekeObsidian/docs/Caddyfile /etc/caddy/Caddyfile
   sudo nano /etc/caddy/Caddyfile
   ```

   Update the following:
   - Replace `rules.yourdomain.com` with your actual subdomain
   - Update the root path to `/opt/NennekeObsidian/vault`

3. Test the configuration and reload:

   ```bash
   sudo caddy validate --config /etc/caddy/Caddyfile
   sudo systemctl reload caddy
   ```

4. Ensure your DNS is configured to point `rules.yourdomain.com` to your server's IP address.

#### Option B: Using nginx

1. Install nginx:

   ```bash
   sudo apt install -y nginx
   ```

2. Copy and configure the nginx configuration:

   ```bash
   sudo cp /opt/NennekeObsidian/docs/nginx.conf /etc/nginx/sites-available/nenneke-vault
   sudo nano /etc/nginx/sites-available/nenneke-vault
   ```

   Update the following:
   - Replace `your-domain.com` with your actual domain
   - Update the root path to `/opt/NennekeObsidian/vault`

3. Enable the site and test:

   ```bash
   sudo ln -s /etc/nginx/sites-available/nenneke-vault /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. For HTTPS, use Certbot to obtain a Let's Encrypt certificate:

   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d rules.yourdomain.com
   ```

### 3.3 Verify the Web View

Open your browser and navigate to `https://rules.yourdomain.com`. You should see the Docsify-powered rulebook.

---

## 4. Cron Jobs

This section covers setting up automated tasks, including the vault backup script.

### 4.1 Automated Backup System

The vault includes an automated backup system that creates timestamped, compressed archives to prevent data loss.

#### Backup Script

The backup script is located at `scripts/backup-vault.sh`. It performs the following operations:

1. Pulls the latest changes from the remote repository (`git pull`)
2. Creates a compressed archive (`backups/vault-backup-YYYY-MM-DD.tar.gz`)
3. Automatically deletes backups older than 30 days

#### Setting Up the Cron Job

1. Ensure the script is executable:

   ```bash
   chmod +x /opt/NennekeObsidian/scripts/backup-vault.sh
   ```

2. Open the crontab editor:

   ```bash
   crontab -e
   ```

3. Add the following line to schedule the backup at 2 AM daily:

   ```cron
   0 2 * * * /opt/NennekeObsidian/scripts/backup-vault.sh >> /var/log/vault-backup.log 2>&1
   ```

4. Save and exit the editor.

#### Verifying the Cron Job

To verify that the cron job is set up correctly:

```bash
crontab -l
```

This will list all scheduled cron jobs for the current user.

### 4.2 Manual Backup

To run a backup manually:

```bash
cd /opt/NennekeObsidian
./scripts/backup-vault.sh
```

### 4.3 Backup Storage

Backups are stored in the `backups/` directory at the repository root. This directory is excluded from version control via `.gitignore`.

### 4.4 Restoring from Backup

To restore the vault from a backup:

1. Navigate to the repository root:

   ```bash
   cd /opt/NennekeObsidian
   ```

2. Extract the backup archive:

   ```bash
   tar -xzf backups/vault-backup-YYYY-MM-DD.tar.gz
   ```

   This will restore the `vault/` directory from the backup.

---

## Troubleshooting

### Discord Bot Issues

**Bot not responding to commands:**
- Verify the bot is online: `pm2 status` or `systemctl status discord-bot`
- Check logs: `pm2 logs nenneke-discord-bot` or `journalctl -u discord-bot`
- Ensure Message Content Intent is enabled in the Discord Developer Portal

**Bot crashes on startup:**
- Verify the `.env` file contains a valid token
- Check for missing dependencies: `npm install`

### Web View Issues

**502 Bad Gateway or site not loading:**
- Check if Caddy/nginx is running: `systemctl status caddy` or `systemctl status nginx`
- Verify the root path in the configuration points to the vault directory
- Check file permissions: `ls -la /opt/NennekeObsidian/vault`

**HTTPS certificate errors:**
- For Caddy: Certificate provisioning is automatic; ensure DNS is configured correctly
- For nginx: Run `sudo certbot renew --dry-run` to test certificate renewal

### Backup Issues

**Backup script fails:**
- Check the log file: `cat /var/log/vault-backup.log`
- Ensure git credentials are configured for the server
- Verify the backups directory exists and is writable

---

## Quick Reference

| Service | Start | Stop | Status | Logs |
|---------|-------|------|--------|------|
| Bot (PM2) | `pm2 start nenneke-discord-bot` | `pm2 stop nenneke-discord-bot` | `pm2 status` | `pm2 logs nenneke-discord-bot` |
| Bot (systemd) | `sudo systemctl start discord-bot` | `sudo systemctl stop discord-bot` | `sudo systemctl status discord-bot` | `journalctl -u discord-bot -f` |
| Caddy | `sudo systemctl start caddy` | `sudo systemctl stop caddy` | `sudo systemctl status caddy` | `journalctl -u caddy -f` |
| nginx | `sudo systemctl start nginx` | `sudo systemctl stop nginx` | `sudo systemctl status nginx` | `tail -f /var/log/nginx/error.log` |
