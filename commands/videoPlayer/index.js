const ytdl = require("ytdl-core");

const { tocandoEmbed } = require("../embedMessage");
const { queue } = require("../queueMap");

// Creation of the video player
const videoPlayer = async (guild, song) => {
  const serverQueue = queue.get(guild.id);

  // If there isn't any songs inside the queue it will disconnect from the voice channel
  if (!song) {
    serverQueue.loop = false;
    queue.delete(guild.id);
    serverQueue.voice_channel.leave();
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
  const dispatcher = await serverQueue?.connection
    .play(stream, {
      seek: 0,
      volume: 1,
    })
    .on("finish", () => {
      if (serverQueue?.songs.length > 0) {
        if (serverQueue?.loop) {
          serverQueue.songs.push(serverQueue.songs.shift());
        } else {
          serverQueue.songs.shift();
        }

        videoPlayer(guild, serverQueue.songs[0]?.url);
      } else {
        videoPlayer(guild, false);
        serverQueue.loop = false;
        serverQueue.voice_channel.leave();
        return serverQueue.text_channel.send(
          `Fui de dormes família tmj sempre tlgd? 💪😎🥱🤰👨‍🦯`
        );
      }
    })
    .on("error", (error) => {
      console.log(error);
      return serverQueue?.songs.length > 0
        ? videoPlayer(guild, serverQueue.songs[0]?.url)
        : videoPlayer(guild, false);
    });
  if (serverQueue?.loop) {
    return;
  } else {
    tocandoEmbed(serverQueue);
  }
};

module.exports.videoPlayer = videoPlayer;
