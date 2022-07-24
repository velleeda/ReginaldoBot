const { queue } = require("./queueMap");
const { videoPlayer } = require("./videoPlayer");

module.exports = {
  name: "skip",
  aliases: "s",
  description: "Skips the song",
  async execute(message, args) {
    // Necessary variables
    const voiceChannel = await message.member.voice.channel;
    const botChannel = await message.guild.me.voice.channel;
    const serverQueue = queue.get(message.guild.id);
    //

    // Simple verifications
    if (!voiceChannel)
      return message.channel.send(
        "Tem que ta numa call pra usar o comando PORRA 🤦‍♂️"
      );
    if (botChannel && botChannel !== voiceChannel)
      return message.channel.send("Tem que ta na msm call q o bot pra usar 😑");
    if (!serverQueue) return message.channel.send("Não tem musca na queue 😕");
    //

    // If the queue only has one song(the one that's already playing) it will disconnect
    if (serverQueue.songs.length === 1) {
      serverQueue.loop = false;
      queue.delete(message.guild.id);
      return voiceChannel.leave();
    }
    //

    // Shifts to the next song and sets it into the videoPlayer
    serverQueue?.songs.shift();
    videoPlayer(message.guild, serverQueue.songs[0]?.url);
    //
    await message.channel.send("Pulei 😅");
  },
};
