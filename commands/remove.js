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
      .setTitle("Tocando 🍖🥡🍜🍢")
      .setColor("#000");

    // Simple verifications
    if (!voiceChannel)
      return message.channel.send(
        "Tem que ta numa call pra usar o comando PORRA 🤦‍♂️"
      );
    if (!serverQueue) {
      message.channel.send("Não tem musca na queue 😕");
      return message.channel.send(embed);
    }
    if (!botChannel) return message.channel.send("Nem to em call mankk 🤣😂😂");
    if (botChannel !== voiceChannel)
      return message.channel.send("Tem que ta na msm call q o bot pra usar 😑");
    //

    const number = args.join(" ");

    if (Number.isInteger(parseInt(number))) {
      if (number === "1") {
        return message.channel.send(
          `Não da pra usar esse comando na primera musca man 😕 usa **${process.env.PREFIX}skip**`
        );
      } else if (serverQueue.songs.length >= number) {
        message.channel.send(
          `Removi **${
            serverQueue.songs[number - 1].title
          }** da queue familys ta safe 😤`
        );
        return serverQueue.songs.splice(number - 1, 1);
      } else return message.channel.send("Esse numero nem existe broter 😑");
    } else {
      return message.channel.send("Só trabalho com numeros parcero 🤓");
    }
  },
};
