const { MessageEmbed } = require("discord.js");
const { queue } = require("./queueMap");

module.exports = {
  name: "remove",
  aliases: ["r", "remover"],
  description: "Removes a specified song",
  async execute(message, args) {
    // Necessary variables
    const serverQueue = await queue.get(message.guild.id);
    const voiceChannel = await message.member.voice.channel;
    const botChannel = await message.guild.me.voice.channel;
    //

    let embed = new MessageEmbed()
      .setTitle("Tocando ๐๐ฅก๐๐ข")
      .setColor("#000");

    // Simple verifications
    if (!voiceChannel)
      return message.channel.send(
        "Tem que ta numa call pra usar o comando PORRA ๐คฆโโ๏ธ"
      );
    if (!serverQueue) {
      message.channel.send("Nรฃo tem musca na queue ๐");
      return message.channel.send(embed);
    }
    if (!botChannel) return message.channel.send("Nem to em call mankk ๐คฃ๐๐");
    if (botChannel !== voiceChannel)
      return message.channel.send("Tem que ta na msm call q o bot pra usar ๐");
    //

    const number = args.join(" ");

    if (Number.isInteger(parseInt(number))) {
      if (number === "1") {
        return message.channel.send(
          `Nรฃo da pra usar esse comando na primera musca man ๐ usa **${process.env.PREFIX}skip**`
        );
      } else if (serverQueue.songs.length >= number) {
        message.channel.send(
          `Removi **${
            serverQueue.songs[number - 1].title
          }** da queue familys ta safe ๐ค`
        );
        return serverQueue.songs.splice(number - 1, 1);
      } else return message.channel.send("Esse numero nem existe broter ๐");
    } else {
      return message.channel.send("Sรณ trabalho com numeros parcero ๐ค");
    }
  },
};
