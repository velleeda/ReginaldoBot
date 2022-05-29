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
    // Necessary variables
    const serverQueue = await queue.get(message.guild.id);
    const voiceChannel = await message.member.voice.channel;
    const botChannel = await message.guild.me.voice.channel;

    // Simple verifications
    if (!voiceChannel)
      return message.channel.send(
        "Tem que ta numa call pra usar o comando PORRA 🤦‍♂️"
      );
    if (botChannel && botChannel !== voiceChannel)
      return message.channel.send("Tem que ta na msm call q o bot pra usar 😑");

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.channel.send("CPX! Tu não tem as permissão necessária 🧏‍♂️");
    if (!permissions.has("SPEAK"))
      return message.channel.send("CPX! Tu não tem as permissão necessária 🧏‍♂️");

    if (!args.length)
      return message.channel.send("Tem que mandar o link/nome da musca man!");

    if (args.join().includes("&ab_channel")) {
      argArr = args.join().split("&ab_channel");
      args = [argArr[0]];
    }

    let song = {};

    // Verifies if the argument received is either a youtube playlist link,
    // a youtube video link or the text name of a music
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

    // If the argument received is a playlist it will set all the videos to a
    // playlist with the queue format, if it is unique video it will simply set to
    // the queue format and if it was the text name of a music it will also set it to
    // the queue format
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

    // If the server didn't already have a queue it will create one and if it
    // has it will add the music to the queue
    if (!serverQueue) {
      const queueConstructor = {
        voice_channel: voiceChannel,
        text_channel: message.channel,
        connection: null,
        songs: [],
      };

      queueConstructor.songs = queueConstructor.songs.concat(song);
      queue.set(message.guild.id, queueConstructor);

      // Tries to connect to the voice channel
      // If not possible a message is sent stating connection failed
      try {
        const connection = await voiceChannel.join();
        queueConstructor.connection = connection;
        videoPlayer(message.guild, queueConstructor.songs[0].url);
      } catch (error) {
        queue.delete(message.guild.id);
        message.channel.send("Deu troios conectando guys! 😰");
        console.log(error);
      }
    } else {
      serverQueue.songs = serverQueue.songs.concat(song);
      message.channel.send(`***${song.title}*** adicionada na queue`);
    }
  },
};

// Creation of the video player
const videoPlayer = async (guild, song) => {
  const songQueue = queue.get(guild.id);

  // If there isn't any songs inside the queue it will disconnect from the voice channel
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

  // On play the dispatcher sets the configurations of the song
  // On the end of the song it checks if there's more songs and skips to the next
  // one and disconnects if there's none
  const dispatcher = await songQueue?.connection
    .play(stream, {
      seek: 0,
      volume: 1,
    })
    .on("finish", () => {
      // CHECAR SE TEM MAIS DE UMA MUSCA SE NAO QUITAR!!!

      if (songQueue?.songs.length > 0) {
        songQueue.songs.shift();
        videoPlayer(guild, songQueue.songs[0]?.url);
      } else {
        videoPlayer(guild, false);
        songQueue.voice_channel.leave();
        return songQueue.text_channel.send(
          `Fui de dormes família tmj sempre tlgd? 💪😎🥱🤰👨‍🦯`
        );
      }
    })
    .on("error", (error) => {
      console.log(error);
      return songQueue?.songs.length > 0
        ? videoPlayer(guild, songQueue.songs[0]?.url)
        : videoPlayer(guild, false);
    });

  songQueue.text_channel.send(`Tocando ***${songQueue.songs[0]?.title}***`);
};

module.exports.queue = queue;
module.exports.videoPlayer = videoPlayer;
