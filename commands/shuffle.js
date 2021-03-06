const { MessageEmbed } = require("discord.js");
const { queue } = require("./queueMap");

module.exports = {
  name: "shuffle",
  aliases: ["embaralhar", "blend"],
  description: "Shuffles the server queue",
  async execute(message, args) {
    // Necessary variables
    const serverQueue = await queue.get(message.guild.id);
    const voiceChannel = await message.member.voice.channel;
    const botChannel = await message.guild.me.voice.channel;
    //

    let embed = new MessageEmbed().setTitle("Tocando agora âª").setColor("#000");

    // Simple verifications
    if (!voiceChannel)
      return message.channel.send(
        "Tem que ta numa call pra usar o comando PORRA ð¤¦ââï¸"
      );
    if (!serverQueue) {
      message.channel.send("NÃ£o tem musca na queue ð");
      return message.channel.send(embed);
    }
    if (!botChannel) return message.channel.send("Nem to em call mankk ð¤£ðð");
    if (botChannel !== voiceChannel)
      return message.channel.send("Tem que ta na msm call q o bot pra usar ð");
    //

    function shuffle(array) {
      let currentIndex = array.length,
        randomIndex;

      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        --currentIndex;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    }

    if (serverQueue?.songs.length) {
      const firstElement = serverQueue.songs.shift();
      shuffle(serverQueue.songs);
      serverQueue.songs.unshift(firstElement);
      await message.channel.send("Shufflei guys âð´ââï¸ð¤¼ââï¸.");
    }
  },
};
