const { queue } = require("./queueMap");

module.exports = {
  name: "loop",
  aliases: "l",
  description: "Loops the queue",
  async execute(message, args) {
    // Necessary variables
    const voiceChannel = await message.member.voice.channel;
    const botChannel = await message.guild.me.voice.channel;
    const serverQueue = queue.get(message.guild.id);
    //

    // Simple verifications
    if (!voiceChannel)
      return message.channel.send(
        "Tem que ta numa call pra usar o comando PORRA ð¤¦ââï¸"
      );
    if (botChannel && botChannel !== voiceChannel)
      return message.channel.send("Tem que ta na msm call q o bot pra usar ð");
    if (!serverQueue) return message.channel.send("NÃ£o tem musca na queue ð");
    //

    // If (!bot_channel) return message.channel.send("Nem to em call BURRO");
    if (serverQueue?.loop) {
      serverQueue.loop = false;
      message.channel.send("Desloopei famÃ­lia ð¤¸ââï¸ðªð¦»ð¤");
    } else {
      serverQueue.loop = true;
      message.channel.send("Loopei ð§ð¼ð·ð¥");
    }
    //
  },
};
