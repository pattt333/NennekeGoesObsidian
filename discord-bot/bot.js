require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { exec } = require('child_process');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const VAULT_PATH = path.resolve(__dirname, '..', 'vault');

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content === '!rules sync') {
    try {
      message.channel.send('Syncing vault with remote...');
      
      exec('git pull origin main', { cwd: VAULT_PATH }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing git pull: ${error.message}`);
          message.channel.send(`Error syncing: ${error.message}`);
          return;
        }
        
        if (stderr && !stderr.includes('Already up to date') && !stderr.includes('From')) {
          console.error(`Git stderr: ${stderr}`);
        }
        
        const output = stdout.trim() || 'Already up to date.';
        message.channel.send(`Sync complete:\n\`\`\`\n${output}\n\`\`\``);
      });
    } catch (error) {
      console.error(`Unexpected error: ${error.message}`);
      message.channel.send(`Unexpected error: ${error.message}`);
    }
  }

  if (message.content === '!rules status') {
    try {
      exec('git log --oneline -5', { cwd: VAULT_PATH }, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing git log: ${error.message}`);
          message.channel.send(`Error getting status: ${error.message}`);
          return;
        }
        
        const commits = stdout.trim() || 'No commits found.';
        message.channel.send(`Last 5 commits:\n\`\`\`\n${commits}\n\`\`\``);
      });
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
