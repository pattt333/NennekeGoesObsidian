# NennekeObsidian
# TTRPG Rulebook System
**Central Git repo for our shared Obsidian vault and Discord bot.**
- `./vault/` - The main Obsidian vault (Markdown files)
- `./discord-bot/` - Node.js bot for Discord commands
- `./scripts/` - Utility scripts for sync, backup, etc.
- `./docs/` - Documentation and deployment configurations

## Web View with Docsify

The vault can be served as a static website using [Docsify](https://docsify.js.org/).

### Local Development

To preview the rulebook locally:

1. Install Docsify CLI globally:
   ```bash
   npm install -g docsify-cli
   ```

2. Serve the vault:
   ```bash
   docsify serve ./vault
   ```

3. Open your browser to `http://localhost:3000`

### Deployment

For production deployment, see the configuration files in `./docs/`:
- `Caddyfile` - Configuration for Caddy web server
- `nginx.conf` - Configuration snippet for nginx web server

Adjust the domain and paths in these files to match your server setup.