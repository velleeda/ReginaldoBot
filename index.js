const { Client } = require("discord.js");
require("dotenv").config();

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const prefix = process.env.PREFIX;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
});

client.login(process.env.CLIENT_TOKEN);
