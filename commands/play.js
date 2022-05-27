const ytdl = require("ytdl-core");
const ytSearch = require("yt-search");

const queue = new Map();

module.exports = {
  name: "play",
  aliases: ["p"],
  description: "Plays music",
  async execute(message, args, Discord, client, cmd) {
    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel)
      return message.channel.send(
        "Tem que ta numa call pra usar o comando PORRA 🤦‍♂️"
      );

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.channel.send("CPX! Tu não tem as permissão necessária 🧏‍♂️");
    if (!permissions.has("SPEAK"))
      return message.channel.send("CPX! Tu não tem as permissão necessária 🧏‍♂️");

    const serverQueue = queue.get(message.guild.id);

    if (!args.length)
      return message.channel.send("Tem que mandar o link/nome da musca man!");

    let song = {};

    if (ytdl.validateURL(args[0])) {
      const songInfo = await ytdl.getInfo(args[0]);

      song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
      };
    } else {
      const videoFinder = async (query) => {
        const videoResult = await ytSearch(query);
        return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
      };

      const video = await videoFinder(args.join(" "));

      if (video) {
        song = { title: video.title, url: video.url };
      } else {
        message.channel.send("Achei nada não man 😕");
      }
    }
    if (!serverQueue) {
      const queueConstructor = {
        voice_channel: voiceChannel,
        text_channel: message.channel,
        connection: null,
        songs: [],
      };

      queue.set(message.guild.id, queueConstructor);
      queueConstructor.songs.push(song);

      try {
        const connection = await voiceChannel.join();
        queueConstructor.connection = connection;
        videoPlayer(message.guild, queueConstructor.songs[0]);
      } catch (error) {
        queue.delete(message.guild.id);
        message.channel.send("Deu troios conectando guys! 😰");
        throw error;
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`***${song.title}*** adicionada na queue`);
    }
  },
};

const videoPlayer = async (guild, song) => {
  const songQueue = queue.get(guild.id);

  if (!song) {
    songQueue.voice_channel.leave();
    queue.delete(guild.id);
    return;
  }
  const stream = ytdl(song.url, { filter: "audioonly" });
  songQueue.connection.play(stream, { seek: 0, volume: 1 }).on("finish", () => {
    songQueue.songs.shift();
    videoPlayer(guild, songQueue.songs[0]);
  });

  await songQueue.text_channel.send(`Tocando ***${song.title}***`);
};
