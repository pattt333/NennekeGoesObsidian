require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const VAULT_PATH = path.resolve(__dirname, '..', 'vault');

// Command handlers map for maintainability
const commands = {
  '!rules sync': handleSync,
  '!rules status': handleStatus
};

function handleSync(message) {
  message.channel.send('Syncing vault with remote...');
  
  execFile('git', ['pull', 'origin', 'main'], { cwd: VAULT_PATH }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing git pull: ${error.message}`);
      message.channel.send(`Error syncing: ${error.message}`);
      return;
    }
    
    const output = stdout.trim() || 'Already up to date.';
    message.channel.send(`Sync complete:\n\`\`\`\n${output}\n\`\`\``);
  });
}

function handleStatus(message) {
  execFile('git', ['log', '--oneline', '-5'], { cwd: VAULT_PATH }, (error, stdout) => {
    if (error) {
      console.error(`Error executing git log: ${error.message}`);
      message.channel.send(`Error getting status: ${error.message}`);
      return;
    }
    
    const commits = stdout.trim() || 'No commits found.';
    message.channel.send(`Last 5 commits:\n\`\`\`\n${commits}\n\`\`\``);
  });
}

// Discord message limit
const DISCORD_MAX_LENGTH = 2000;
// Reserve space for code block formatting (```md\n...\n```)
const CODE_BLOCK_OVERHEAD = 10;
const MAX_CONTENT_LENGTH = DISCORD_MAX_LENGTH - CODE_BLOCK_OVERHEAD;

/**
 * Paginates content into chunks that fit within Discord's message limit
 * @param {string} content - The content to paginate
 * @returns {string[]} - Array of content chunks
 */
function paginateContent(content) {
  const chunks = [];
  let remaining = content;
  
  while (remaining.length > 0) {
    if (remaining.length <= MAX_CONTENT_LENGTH) {
      chunks.push(remaining);
      break;
    }
    
    // Find a good breaking point (newline) within the limit
    let breakPoint = remaining.lastIndexOf('\n', MAX_CONTENT_LENGTH);
    if (breakPoint === -1 || breakPoint === 0) {
      // No newline found, break at max length
      breakPoint = MAX_CONTENT_LENGTH;
    }
    
    chunks.push(remaining.substring(0, breakPoint));
    remaining = remaining.substring(breakPoint).replace(/^\n/, ''); // Remove leading newline
  }
  
  return chunks;
}

// Resolved vault path for security validation
const RESOLVED_VAULT_PATH = path.resolve(VAULT_PATH);

/**
 * Handles the !rules find command to display content of a Markdown file
 * @param {Message} message - The Discord message object
 * @param {string} filePath - The path to the file relative to the vault
 */
async function handleFind(message, filePath) {
  if (!filePath) {
    message.channel.send('Usage: `!rules find <file-path>`\nExample: `!rules find rules/combat/initiative`');
    return;
  }
  
  // Add .md extension if not present
  const fullFileName = filePath.endsWith('.md') ? filePath : `${filePath}.md`;
  
  // Construct and resolve the full path
  const fullPath = path.join(VAULT_PATH, fullFileName);
  const resolvedPath = path.resolve(fullPath);
  
  // Security check: Ensure the resolved path is within the vault directory
  // This prevents directory traversal attacks (e.g., ../../../etc/passwd)
  if (!resolvedPath.startsWith(RESOLVED_VAULT_PATH + path.sep) && resolvedPath !== RESOLVED_VAULT_PATH) {
    message.channel.send('Error: Invalid file path. Path must be within the vault directory.');
    return;
  }
  
  try {
    const content = await fs.readFile(resolvedPath, 'utf-8');
    
    if (!content.trim()) {
      message.channel.send(`File \`${fullFileName}\` is empty.`);
      return;
    }
    
    const chunks = paginateContent(content);
    
    for (let i = 0; i < chunks.length; i++) {
      const pageInfo = chunks.length > 1 ? ` (Page ${i + 1}/${chunks.length})` : '';
      await message.channel.send(`\`\`\`md\n${chunks[i]}\n\`\`\`${pageInfo}`);
      // Small delay between messages to avoid rate limiting
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      message.channel.send(`Error: File not found: \`${fullFileName}\``);
    } else if (error.code === 'EISDIR') {
      message.channel.send(`Error: \`${fullFileName}\` is a directory, not a file.`);
    } else {
      console.error(`Error reading file ${fullFileName}: ${error.message}`);
      message.channel.send('Error: An unexpected error occurred while reading the file.');
    }
  }
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Check for exact command matches first
  const handler = commands[message.content];
  if (handler) {
    try {
      handler(message);
    } catch (error) {
      console.error(`Unexpected error: ${error.message}`);
      message.channel.send(`Unexpected error: ${error.message}`);
    }
    return;
  }
  
  // Check for !rules find command with arguments
  if (message.content.startsWith('!rules find ')) {
    const filePath = message.content.slice('!rules find '.length).trim();
    try {
      await handleFind(message, filePath);
    } catch (error) {
      console.error(`Unexpected error: ${error.message}`);
      message.channel.send(`Unexpected error: ${error.message}`);
    }
    return;
  }
  
  // Handle !rules find without arguments
  if (message.content === '!rules find') {
    try {
      await handleFind(message, '');
    } catch (error) {
      console.error(`Unexpected error: ${error.message}`);
      message.channel.send(`Unexpected error: ${error.message}`);
    }
  }
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('Error: DISCORD_TOKEN environment variable is not set.');
  process.exit(1);
}

client.login(token);
