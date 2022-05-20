const { Client } = require("discord.js");
require("dotenv").config();

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const prefix = process.env.PREFIX;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  if (msg.author.bot) return;
  if (msg.content.indexOf(prefix.length) !== 0) return;

  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    msg.reply("pong");
  }
});

client.login(process.env.CLIENT_TOKEN);
