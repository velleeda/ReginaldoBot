const { queue } = require("./queueMap");

module.exports = {
  name: "disconnect",
  aliases: ["dc", "leave"],
  description: "Stops the bot and leaves the voice channel",
  async execute(message, args) {
    // Necessary variables
    const voiceChannel = await message.member.voice.channel;
    const botChannel = await message.guild.me.voice.channel;
    const serverQueue = queue.get(message.guild.id);
    //

    // Simple verifications
    if (!voiceChannel)
      return message.channel.send(
        "Tem que ta numa call pra usar o comando PORRA π€¦ββοΈ"
      );
    if (botChannel && botChannel !== voiceChannel)
      return message.channel.send("Tem que ta na msm call q o bot pra usar π");
    //

    // If the queue has any songs it will delete it
    if (serverQueue?.songs.length > 0) {
      serverQueue.loop = false;
      queue.delete(message.guild.id);
    }
    //

    await voiceChannel.leave();

    await message.channel.send(
      "Fui de dormes famΓ­lia tmj sempre tlgd? πͺππ₯±π€°π¨βπ¦―"
    );
  },
};
