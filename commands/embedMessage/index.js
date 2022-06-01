const { MessageEmbed } = require("discord.js");

function tocandoEmbed(serverQueue) {
  const embed = new MessageEmbed()
    .setTitle("Tocando 🍖🥡🍜🍢")
    .setColor("#000")
    .setThumbnail(`${serverQueue.songs[0].thumbnail}`)
    .setDescription(
      `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`
    )
    .addFields(
      { name: "Canal", value: serverQueue.songs[0].author, inline: true },
      {
        name: "Duração",
        value: serverQueue.songs[0].videoLength,
        inline: true,
      },
      {
        name: "\u200B",
        value: "`Requested by:`" + " " + serverQueue.songs[0].userRequested,
      }
    );

  return serverQueue.text_channel.send(embed);
}

function adicionadoNaQueueEmbed(serverQueue) {
  let latestSongAdded = serverQueue.songs.length - 1;
  const embed = new MessageEmbed()
    .setTitle("Adicionado na queue 🛵🦼🪂🧭")
    .setColor("#000")
    .setThumbnail(`${serverQueue.songs[latestSongAdded].thumbnail}`)
    .setDescription(
      `[${serverQueue.songs[latestSongAdded].title}](${serverQueue.songs[latestSongAdded].url})`
    )
    .addFields(
      {
        name: "Canal",
        value: serverQueue.songs[latestSongAdded].author,
        inline: true,
      },
      {
        name: "Duração",
        value: serverQueue.songs[latestSongAdded].videoLength,
        inline: true,
      },
      {
        name: "\u200B",
        value:
          "`Requested by:`" +
          " " +
          serverQueue.songs[latestSongAdded].userRequested,
      }
    );

  return serverQueue.text_channel.send(embed);
}

module.exports.tocandoEmbed = tocandoEmbed;
module.exports.adicionadoNaQueueEmbed = adicionadoNaQueueEmbed;
