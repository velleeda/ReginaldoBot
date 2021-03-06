const { queue } = require("./queueMap");

module.exports = {
  name: "clear",
  aliases: ["c", "limpa"],
  description: "Clears the server queue",
  async execute(message, args) {
    // Necessary variables
    const serverQueue = await queue.get(message.guild.id);
    const voiceChannel = await message.member.voice.channel;
    const botChannel = await message.guild.me.voice.channel;
    //

    // Simple verifications
    if (!voiceChannel)
      return message.channel.send(
        "Tem que ta numa call pra usar o comando PORRA ð¤¦ââï¸"
      );
    if (!serverQueue) {
      return message.channel.send("NÃ£o tem musca na queue ð");
    }
    if (!botChannel) return message.channel.send("Nem to em call mankk ð¤£ðð");
    if (botChannel !== voiceChannel)
      return message.channel.send("Tem que ta na msm call q o bot pra usar ð");
    //

    if (serverQueue?.songs.length) {
      serverQueue.loop = false;
      queue.delete(message.guild.id);
      await serverQueue.connection.dispatcher.end();

      await message.channel.send("Clearei familys ðððð´");
    }
  },
};
