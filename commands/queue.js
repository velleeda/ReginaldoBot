const { MessageEmbed } = require("discord.js");
const { MessageButton, MessageActionRow } = require("discord-buttons");

const { queue } = require("./queueMap");

module.exports = {
  name: "queue",
  aliases: "q",
  description: "This is a queue command",
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

    var disable = [false, false, false, false];
    let embedMessage;
    var serverQueueArray = [],
      page = args[0] || 1;

    let embed = new MessageEmbed()
      .setTitle("Muscas na queue 🌈🔥❄⚡🌠🚿")
      .setColor("#000");

    if (botChannel && serverQueue?.songs?.length) {
      for (let i = 0; serverQueue.songs.length > i; i++) {
        serverQueueArray.push(
          `${i + 1}. [${serverQueue.songs[i].videoLength}]` +
            ` [${serverQueue.songs[i].title}](${serverQueue.songs[i].url})` +
            ` requested by ${serverQueue.songs[i].userRequested}\n`
        );
      }
      serverQueueArray = separate(serverQueueArray, 10);
      if (serverQueueArray[page - 1] == undefined)
        message.channel.send(
          "Ta tentando acessa página que nem existe ékk? TA LOCO PORRA"
        );
      else send();
    }

    async function send() {
      if (page === serverQueueArray.length) {
        disable[2] = true;
        disable[3] = true;
      } else {
        disable[2] = false;
        disable[3] = false;
      }

      if (page === 1) {
        disable[0] = true;
        disable[1] = true;
      } else {
        disable[0] = false;
        disable[1] = false;
      }

      let secondsTotal = 0;
      for (let i = 0; i < serverQueue.songs.length; i++) {
        secondsTotal = secondsTotal + serverQueue.songs[i].seconds;
      }

      embed.setDescription(serverQueueArray[page - 1]);
      embed.setFooter(
        "Página " +
          page +
          " de " +
          serverQueueArray.length +
          " | Duração da fila: " +
          `${ssTohms(secondsTotal)}`
      );

      let firstPage = new MessageButton()
        .setID("firstPage")
        .setEmoji("⏮")
        .setDisabled(disable[0])
        .setStyle(1);

      let previousPage = new MessageButton()
        .setID("previousPage")
        .setDisabled(disable[1])
        .setEmoji("⏪")
        .setStyle(1);

      let nextPage = new MessageButton()
        .setID("nextPage")
        .setEmoji("⏩")
        .setDisabled(disable[2])
        .setStyle(1);

      let lastPage = new MessageButton()
        .setID("lastPage")
        .setEmoji("⏭")
        .setDisabled(disable[3])
        .setStyle(1);

      let row = new MessageActionRow()
        .addComponent(firstPage)
        .addComponent(previousPage)
        .addComponent(nextPage)
        .addComponent(lastPage);

      if (embedMessage) {
        embedMessage.edit({ content: embed, components: [row] });
      } else {
        embedMessage = await message.channel.send({
          content: embed,
          components: [row],
        });
      }

      const filter = (button) => button.clicker.user.id === message.author.id;
      const collector = embedMessage.createButtonCollector(filter, {
        max: 1,
        time: 60000,
      });

      collector.on("collect", async (button) => {
        embed
          .setDescription(serverQueueArray[page - 1])
          .setFooter("page " + page + " de " + serverQueueArray.length);

        if (button.id === "firstPage") {
          button.reply.defer();
          page = 1;
          send();
        }
        if (button.id === "previousPage") {
          button.reply.defer();
          page--;
          send();
        }
        if (button.id === "nextPage") {
          button.reply.defer();
          page++;
          send();
        }
        if (button.id === "lastPage") {
          button.reply.defer();
          page = serverQueueArray.length;
          send();
        }
      });
    }
  },
};

function separate(array, size) {
  if (size <= 0) throw "Invalid chunk size";
  let Row = [];
  for (let i = 0, length = array.length; i < length; i += size)
    Row.push(array.slice(i, i + size));
  return Row;
}

function ssTohms(secondsTotal) {
  let secondsNumber = parseInt(secondsTotal, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor(secondsNumber / 60) % 60;
  let seconds = secondsNumber % 60;

  return [hours, minutes, seconds]
    .map((value) => (value < 10 ? "0" + value : value))
    .filter((value, i) => value !== "00" || i > 0)
    .join(":");
}
