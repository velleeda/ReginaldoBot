const { MessageEmbed, MessageCollector } = require("discord.js");
const ytSearch = require("ytSearchVelleda");
const { queue } = require("./queueMap");
const play = require("./play");

module.exports = {
  name: "search",
  aliases: "procura",
  description: "Searches songs with the specified name",
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
    if (botChannel && botChannel !== voiceChannel)
      return message.channel.send("Tem que ta na msm call q o bot pra usar 😑");
    //

    const videoResult = await ytSearch.search(`${args.join(" ")}`);

    const filter = (msg) => msg.author.id === message.author.id;

    let searchResult = "";

    for (let i = 0; i < 10; i++) {
      searchResult =
        searchResult +
        `${i + 1}. [${videoResult[i].title}](${videoResult[i].url}) [${
          videoResult[i].duration_raw
        }]` +
        "\n\n";
    }

    let embed = new MessageEmbed()
      .setColor("#000")
      .setTitle("Videos encontrados 👇🤏🏃‍♂️🤸‍♂️")
      .setDescription(searchResult);

    const embedMsg = await message.channel.send(embed);

    const collector = new MessageCollector(message.channel, filter, {
      max: 1,
    });

    collector.on("collect", async (msg) => {
      if (msg.content == "cancel") return msg.react("❌");

      try {
        if (Number.isInteger(parseInt(msg.content))) {
          videoNumber = parseInt(msg.content - 1);
          msg.react("☝");
          embedMsg.delete();
          play.execute(msg, [videoResult[videoNumber].url]);
        } else {
          msg.channel.send("Só trabalho com numeros parcero 🤓");
        }
      } catch (error) {
        console.log(error);
      }
    });
  },
};

function hmsToSecondsOnly(str) {
  var p = str.split(":"),
    s = 0,
    m = 1;

  while (p.length > 0) {
    s += m * parseInt(p.pop(), 10);
    m *= 60;
  }
  return s;
}

function ssTohms(secs) {
  var sec_num = parseInt(secs, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor(sec_num / 60) % 60;
  var seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
}
