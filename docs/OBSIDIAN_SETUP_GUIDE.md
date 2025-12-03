# Obsidian Setup Guide

This guide will help you set up Obsidian and connect to our shared TTRPG rulebook vault.

## What You'll Need

- A computer (Windows, Mac, or Linux)
- An internet connection
- Git installed on your computer (see Step 1)
- Obsidian installed (see Step 2)

---

## Step 1: Install Git

Git is a tool that lets us all work on the same files without overwriting each other's changes.

### Windows
1. Go to [git-scm.com/download/win](https://git-scm.com/download/win)
2. Download and run the installer
3. Accept all default options during installation

### Mac
1. Open **Terminal** (search for it in Spotlight)
2. Type `git --version` and press Enter
3. If Git isn't installed, you'll be prompted to install it

### Linux
1. Open a terminal
2. Run: `sudo apt install git` (Ubuntu/Debian) or `sudo dnf install git` (Fedora)

---

## Step 2: Install Obsidian

1. Go to [obsidian.md/download](https://obsidian.md/download)
2. Download the version for your operating system
3. Run the installer and follow the prompts

---

## Step 3: Clone the Repository

This step downloads our shared vault to your computer.

1. Open a terminal (or Git Bash on Windows)
2. Navigate to where you want to store the vault:
   ```
   cd ~/Documents
   ```
3. Clone the repository:
   ```
   git clone https://github.com/pattt333/NennekeObsidian.git
   ```
4. Wait for the download to complete

---

## Step 4: Open the Vault in Obsidian

1. Open **Obsidian**
2. Click **"Open folder as vault"**
3. Navigate to the folder you cloned (e.g., `Documents/NennekeObsidian`)
4. Select the **`vault`** folder inside it
5. Click **"Open"**

You should now see the vault structure with rules, characters, and notes folders.

---

## Step 5: Install the Obsidian Git Plugin

The Git plugin lets you sync changes directly from within Obsidian.

1. In Obsidian, go to **Settings** (click the gear icon in the bottom-left)
2. Click **"Community plugins"** in the left sidebar
3. Click **"Turn on community plugins"** if prompted
4. Click **"Browse"**
5. Search for **"Obsidian Git"**
6. Click on it, then click **"Install"**
7. After installation, click **"Enable"**

---

## Step 6: Configure the Git Plugin

1. Go to **Settings** → **Community plugins** → **Obsidian Git** → **Options**
2. Recommended settings:
   - **Vault backup interval (minutes)**: `0` (we'll sync manually)
   - **Auto pull interval (minutes)**: `5` (checks for updates every 5 minutes)
   - **Commit message**: `Update from Obsidian`
   - **Pull updates on startup**: ✅ Enabled

---

## Step 7: Syncing Your Changes

### Pulling Latest Changes (Get Updates from Others)

1. Open the **Command Palette**: Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac)
2. Type **"Obsidian Git: Pull"**
3. Press Enter

### Pushing Your Changes (Share Your Edits)

1. Open the **Command Palette**: Press `Ctrl+P` (Windows/Linux) or `Cmd+P` (Mac)
2. Type **"Obsidian Git: Commit all changes"**
3. Press Enter and type a brief description of your changes
4. Open the Command Palette again
5. Type **"Obsidian Git: Push"**
6. Press Enter

---

## Troubleshooting

### "Authentication failed" error
- Make sure you're logged into GitHub in your browser
- You may need to set up SSH keys or a personal access token
- Ask a group member for help if needed

### "Merge conflict" error
- This happens when two people edit the same file at the same time
- Ask a more experienced member to help resolve it
- In the future, communicate with the group before editing shared files

### Plugin not working
- Make sure you enabled the plugin after installing it
- Try restarting Obsidian
- Check that Git is properly installed on your computer

---

## Need Help?

If you get stuck, reach out to the group on Discord. Someone will be happy to help!
