const { Client } = require("discord.js");
require("dotenv").config();

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const prefix = process.env.PREFIX;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (message.content.indexOf(prefix.length) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    message.reply("Pong!");
  }
});

client.login(process.env.CLIENT_TOKEN);
