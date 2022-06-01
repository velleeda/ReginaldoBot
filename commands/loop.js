const { queue } = require("./queueMap");

module.exports = {
  name: "loop",
  aliases: "l",
  description: "Loops the queue",
  async execute(message, args) {
    const voiceChannel = await message.member.voice.channel;
    const botChannel = await message.guild.me.voice.channel;
    const serverQueue = queue.get(message.guild.id);

    if (!voiceChannel)
      return message.channel.send(
        "Tem que ta numa call pra usar o comando PORRA 🤦‍♂️"
      );
    if (botChannel && botChannel !== voiceChannel)
      return message.channel.send("Tem que ta na msm call q o bot pra usar 😑");
    if (!serverQueue) return message.channel.send("Não tem musca na queue 😕");

    // If (!bot_channel) return message.channel.send("Nem to em call BURRO");
    if (serverQueue?.loop) {
      serverQueue.loop = false;
      message.channel.send("Desloopei família 🤸‍♂️💪🦻🤏");
    } else {
      serverQueue.loop = true;
      message.channel.send("Loopei 🎧🎼🎷🥁");
    }
  },
};
