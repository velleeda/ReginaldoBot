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
        "Tem que ta numa call pra usar o comando PORRA 🤦‍♂️"
      );
    if (!serverQueue) {
      return message.channel.send("Não tem musca na queue 😕");
    }
    if (!botChannel) return message.channel.send("Nem to em call mankk 🤣😂😂");
    if (botChannel !== voiceChannel)
      return message.channel.send("Tem que ta na msm call q o bot pra usar 😑");
    //

    if (serverQueue?.songs.length) {
      serverQueue.loop = false;
      queue.delete(message.guild.id);
      await serverQueue.connection.dispatcher.end();

      await message.channel.send("Clearei familys 😎😊😋😴");
    }
  },
};
