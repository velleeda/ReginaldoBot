// Requirements
const Discord = require("discord.js");
require("dotenv").config();

// Client and Prefix Creation
const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
});

//Command & Event Collection Creation
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
require("discord-buttons")(client);

["commandHandler", "eventHandler"].forEach((handler) => {
  require(`./handlers/${handler}`)(client, Discord);
});

// Client Login
client.login(process.env.CLIENT_TOKEN);
