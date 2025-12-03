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

// File size limit for !rules show command (50KB)
const MAX_FILE_SIZE = 50 * 1024;

// Emoji constants for command feedback
const EMOJI_PROCESSING = '⏳';
const EMOJI_SUCCESS = '✅';
const EMOJI_FAILURE = '❌';

// Command handlers map for maintainability
const commands = {
  '!rules sync': handleSync,
  '!rules status': handleStatus,
  '!rules help': handleHelp
};

/**
 * Helper to update emoji reaction on message
 * @param {Message} message - The Discord message object
 * @param {string} oldEmoji - The emoji to remove
 * @param {string} newEmoji - The emoji to add
 */
async function updateReaction(message, oldEmoji, newEmoji) {
  try {
    const reaction = message.reactions.cache.get(oldEmoji);
    if (reaction) {
      await reaction.users.remove(message.client.user);
    }
    await message.react(newEmoji);
  } catch (error) {
    console.error(`Error updating reaction: ${error.message}`);
  }
}

async function handleSync(message) {
  message.channel.send('Syncing vault with remote...');
  
  execFile('git', ['pull', 'origin', 'main'], { cwd: VAULT_PATH }, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing git pull: ${error.message}`);
      message.channel.send(`Error syncing: ${error.message}`);
      await updateReaction(message, EMOJI_PROCESSING, EMOJI_FAILURE);
      return;
    }
    
    const output = stdout.trim() || 'Already up to date.';
    message.channel.send(`Sync complete:\n\`\`\`\n${output}\n\`\`\``);
    await updateReaction(message, EMOJI_PROCESSING, EMOJI_SUCCESS);
  });
}

async function handleStatus(message) {
  execFile('git', ['log', '--oneline', '-5'], { cwd: VAULT_PATH }, async (error, stdout) => {
    if (error) {
      console.error(`Error executing git log: ${error.message}`);
      message.channel.send(`Error getting status: ${error.message}`);
      await updateReaction(message, EMOJI_PROCESSING, EMOJI_FAILURE);
      return;
    }
    
    const commits = stdout.trim() || 'No commits found.';
    message.channel.send(`Last 5 commits:\n\`\`\`\n${commits}\n\`\`\``);
    await updateReaction(message, EMOJI_PROCESSING, EMOJI_SUCCESS);
  });
}

async function handleHelp(message) {
  const helpText = `**Available Commands:**

\`!rules help\` - Display this help message with all available commands
\`!rules sync\` - Sync the vault with the remote repository (git pull)
\`!rules status\` - Show the last 5 commits in the vault
\`!rules show <path>\` - Display the contents of a Markdown file from the vault
  • Example: \`!rules show rules/combat/initiative\`
  • File path should be relative to the vault directory
  • Files larger than 50KB cannot be displayed`;
  
  await message.channel.send(helpText);
  await updateReaction(message, EMOJI_PROCESSING, EMOJI_SUCCESS);
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
 * Sanitizes user input for file paths to prevent directory traversal attacks
 * @param {string} filePath - The user-provided file path
 * @returns {Object} - { isValid: boolean, sanitizedPath: string, errorMessage: string }
 */
function sanitizeFilePath(filePath) {
  // Block explicit directory traversal patterns (including URL-encoded variants)
  const decodedPath = decodeURIComponent(filePath);
  if (decodedPath.includes('../') || decodedPath.includes('..\\') || 
      filePath.includes('../') || filePath.includes('..\\')) {
    return { isValid: false, sanitizedPath: '', errorMessage: 'Error: Directory traversal patterns (../) are not allowed.' };
  }
  
  // Normalize the path and check for any remaining .. segments
  const normalizedPath = path.normalize(filePath);
  if (normalizedPath.includes('..')) {
    return { isValid: false, sanitizedPath: '', errorMessage: 'Error: Directory traversal patterns are not allowed.' };
  }
  
  // Block paths that start with / or \ (absolute paths)
  if (filePath.startsWith('/') || filePath.startsWith('\\') ||
      normalizedPath.startsWith('/') || normalizedPath.startsWith('\\')) {
    return { isValid: false, sanitizedPath: '', errorMessage: 'Error: Absolute paths are not allowed.' };
  }
  
  // Block null bytes which can be used to bypass security checks
  if (filePath.includes('\0')) {
    return { isValid: false, sanitizedPath: '', errorMessage: 'Error: Invalid characters in file path.' };
  }
  
  return { isValid: true, sanitizedPath: normalizedPath, errorMessage: '' };
}

/**
 * Handles the !rules show command to display content of a Markdown file
 * @param {Message} message - The Discord message object
 * @param {string} filePath - The path to the file relative to the vault
 */
async function handleShow(message, filePath) {
  if (!filePath) {
    await message.channel.send('Usage: `!rules show <file-path>`\nExample: `!rules show rules/combat/initiative`');
    await updateReaction(message, EMOJI_PROCESSING, EMOJI_FAILURE);
    return;
  }
  
  // Sanitize user input for file paths
  const sanitizeResult = sanitizeFilePath(filePath);
  if (!sanitizeResult.isValid) {
    await message.channel.send(sanitizeResult.errorMessage);
    await updateReaction(message, EMOJI_PROCESSING, EMOJI_FAILURE);
    return;
  }
  
  // Use sanitized path for all subsequent operations
  const sanitizedPath = sanitizeResult.sanitizedPath;
  
  // Add .md extension if not present
  const fullFileName = sanitizedPath.endsWith('.md') ? sanitizedPath : `${sanitizedPath}.md`;
  
  // Construct and resolve the full path
  const fullPath = path.join(VAULT_PATH, fullFileName);
  const resolvedPath = path.resolve(fullPath);
  
  // Security check: Ensure the resolved path is within the vault directory
  // This is a defense-in-depth check after sanitization
  if (!resolvedPath.startsWith(RESOLVED_VAULT_PATH + path.sep) && resolvedPath !== RESOLVED_VAULT_PATH) {
    await message.channel.send('Error: Invalid file path. Path must be within the vault directory.');
    await updateReaction(message, EMOJI_PROCESSING, EMOJI_FAILURE);
    return;
  }
  
  try {
    // Check file size before reading to prevent spam
    const stats = await fs.stat(resolvedPath);
    if (stats.size > MAX_FILE_SIZE) {
      await message.channel.send(`Error: File is too large (${Math.round(stats.size / 1024)}KB). Maximum allowed size is 50KB.`);
      await updateReaction(message, EMOJI_PROCESSING, EMOJI_FAILURE);
      return;
    }
    
    const content = await fs.readFile(resolvedPath, 'utf-8');
    
    if (!content.trim()) {
      await message.channel.send(`File \`${fullFileName}\` is empty.`);
      await updateReaction(message, EMOJI_PROCESSING, EMOJI_SUCCESS);
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
    
    await updateReaction(message, EMOJI_PROCESSING, EMOJI_SUCCESS);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await message.channel.send(`Error: File not found: \`${fullFileName}\``);
    } else if (error.code === 'EISDIR') {
      await message.channel.send(`Error: \`${fullFileName}\` is a directory, not a file.`);
    } else {
      console.error(`Error reading file ${fullFileName}: ${error.message}`);
      await message.channel.send('Error: An unexpected error occurred while reading the file.');
    }
    await updateReaction(message, EMOJI_PROCESSING, EMOJI_FAILURE);
  }
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Check if the message is a !rules command
  if (!message.content.startsWith('!rules')) return;

  // Add processing emoji at the start of command handling
  try {
    await message.react(EMOJI_PROCESSING);
  } catch (error) {
    console.error(`Error adding processing reaction: ${error.message}`);
  }

  // Check for exact command matches first
  const handler = commands[message.content];
  if (handler) {
    try {
      await handler(message);
    } catch (error) {
      console.error(`Unexpected error: ${error.message}`);
      await message.channel.send(`Unexpected error: ${error.message}`);
      await updateReaction(message, EMOJI_PROCESSING, EMOJI_FAILURE);
    }
    return;
  }
  
  // Check for !rules show command with arguments
  if (message.content.startsWith('!rules show ')) {
    const filePath = message.content.slice('!rules show '.length).trim();
    try {
      await handleShow(message, filePath);
    } catch (error) {
      console.error(`Unexpected error: ${error.message}`);
      await message.channel.send(`Unexpected error: ${error.message}`);
      await updateReaction(message, EMOJI_PROCESSING, EMOJI_FAILURE);
    }
    return;
  }
  
  // Handle !rules show without arguments
  if (message.content === '!rules show') {
    try {
      await handleShow(message, '');
    } catch (error) {
      console.error(`Unexpected error: ${error.message}`);
      await message.channel.send(`Unexpected error: ${error.message}`);
      await updateReaction(message, EMOJI_PROCESSING, EMOJI_FAILURE);
    }
    return;
  }

  // Unknown !rules command - show help suggestion
  await message.channel.send('Unknown command. Use `!rules help` to see available commands.');
  await updateReaction(message, EMOJI_PROCESSING, EMOJI_FAILURE);
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('Error: DISCORD_TOKEN environment variable is not set.');
  process.exit(1);
}

client.login(token);
