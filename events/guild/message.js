const cooldowns = new Map();

module.exports = (client, Discord, message) => {
  const prefix = process.env.PREFIX;
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const cmd = args.shift().toLowerCase();

  const command =
    client.commands.get(cmd) ||
    client.commands.find((a) => a.aliases && a.aliases.includes(cmd));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const currentTime = Date.now();
  const timeStamps = cooldowns.get(command.name);
  const cooldownAmount = command.cooldown * 1000;

  if (timeStamps.has(message.author.id)) {
    const expirationTime = timeStamps.get(message.author.id) + cooldownAmount;

    if (currentTime < expirationTime) {
      const timeLeft = (expirationTime - currentTime) / 1000;

      return message.channel.send(
        `Pera ${timeLeft.toFixed(0)} segundo pra pode usa ${command.name} `
      );
    }
  }

  timeStamps.set(message.author.id, currentTime);
  setTimeout(() => timeStamps.delete(message.author.id), cooldownAmount);

  if (command) command.execute(message, args, Discord, client, cmd);
};
