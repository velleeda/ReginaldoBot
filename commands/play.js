const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const ytSearch = require("youtube-search-without-api-key");

const queue = new Map();

const regYoutubePlaylist = /[?&]list=([^#\&\?]+)/;
const regYoutubeLink =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

module.exports = {
  name: "play",
  aliases: ["p"],
  description: "Plays music",
  async execute(message, args) {
    const serverQueue = await queue.get(message.guild.id);
    const voiceChannel = await message.member.voice.channel;
    const botChannel = await message.guild.me.voice.channel;

    if (!voiceChannel)
      return message.channel.send(
        "Tem que ta numa call pra usar o comando PORRA 🤦‍♂️"
      );

    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (!permissions.has("CONNECT"))
      return message.channel.send("CPX! Tu não tem as permissão necessária 🧏‍♂️");
    if (!permissions.has("SPEAK"))
      return message.channel.send("CPX! Tu não tem as permissão necessária 🧏‍♂️");
    if (botChannel && botChannel !== voiceChannel)
      return message.channel.send("Tem que ta na msm call q o bot pra usar :/");
    if (args.join().includes("&ab_channel")) {
      argArr = args.join().split("&ab_channel");
      args = [argArr[0]];
    }

    let song = {};

    const videoFinder = async (args) => {
      if (String(args).match(regYoutubeLink)) {
        if (String(args).match(regYoutubePlaylist)) {
          const playlistResult = await ytpl(`${args}`);
          return playlistResult ? playlistResult : null;
        } else {
          const videoResult = await ytdl.getInfo(args, function (info) {
            return info;
          });
          return videoResult;
        }
      } else {
        const videoResult = await ytSearch.search(String(args));
        return videoResult.length > 1 ? videoResult[0] : null;
      }
    };

    const video = await videoFinder(args.join(" "));

    if (!video) return message.channel.send("Achei nada não man 😕");

    if (String(args).match(regYoutubePlaylist)) {
      song = [];
      var playlist = video;
      for (let i = 0; playlist.items.length > i; i++) {
        playlistSongs = {
          index: playlist.items[i].index,
          title: playlist.items[i].title,
          url: playlist.items[i].shortUrl,
          videoLength: playlist.items[i].duration,
          author: playlist.items[i].author.name,
          userRequested: message.author.toString(),
        };
        song.push(playlistSongs);
      }
    } else if (ytdl.validateURL(video.videoDetails?.video_url)) {
      song = {
        title: video.videoDetails.title,
        url: video.videoDetails.video_url,
        videoLength: video.videoDetails.lengthSeconds,
        author: video.videoDetails.author.name,
        userRequested: message.author.toString(),
      };
    } else {
      song = {
        title: video.title,
        url: video.url,
        videoLength: video.duration_raw,
        author: video.author, // RESOLVER UNDEFINED
        userRequested: message.author.toString(),
      };
    }

    if (!serverQueue) {
      const queueConstructor = {
        voice_channel: voiceChannel,
        text_channel: message.channel,
        connection: null,
        songs: [],
      };

      queueConstructor.songs = queueConstructor.songs.concat(song);
      queue.set(message.guild.id, queueConstructor);

      try {
        const connection = await voiceChannel.join();
        message.channel.send(
          `Tocando ***${queueConstructor.songs[0].title}***`
        );
        queueConstructor.connection = connection;
        videoPlayer(
          message.guild,
          queueConstructor.songs[0].url,
          message.channel
        );
      } catch (error) {
        queue.delete(message.guild.id);
        message.channel.send("Deu troios conectando guys! 😰");
        console.log(error);
      }
    } else {
      serverQueue.songs = serverQueue.songs.concat(song);
    }
    console.log("fim");
    queueConstructor.songs.onchange;
  },
};

const videoPlayer = async (guild, song) => {
  const songQueue = queue.get(guild.id);

  if (!song) {
    songQueue.voice_channel.leave();
    queue.delete(guild.id);
    return;
  }

  const options = {
    filter: "audioonly",
    highWaterMark: 1 << 25,
    quality: "highestaudio",
  };

  var stream = ytdl(song, options);

  console.log(songQueue);

  const dispatcher = await songQueue?.connection
    .play(stream, {
      seek: 0,
      volume: 1,
    })
    .on("finish", () => {
      // CHECAR SE TEM MAIS DE UMA MUSCA SE NAO QUITAR!!!

      if (songQueue.songs.length > 0) {
        songQueue.songs.shift();
        videoPlayer(guild, songQueue.songs[0].url);
      } else {
        songQueue.voice_channel.leave();
        videoPlayer(guild, false);
        Channel.send(`Fui de dormes família tmj sempre tlgd? 💪😎🥱🤰👨‍🦯`);
      }
    })
    .on("error", (error) => {
      console.log(error);
      return songQueue.songs.length > 0
        ? videoPlayer(guild, songQueue.songs[0].url)
        : videoPlayer(guild, false);
    });
};
