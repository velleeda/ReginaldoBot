const ytdl = require("ytdl-core");

const { tocandoEmbed } = require("../embedMessage");
const { queue } = require("../queueMap");

// Creation of the video player
const videoPlayer = async (guild, song) => {
  const songQueue = queue.get(guild.id);

  // If there isn't any songs inside the queue it will disconnect from the voice channel
  if (!song) {
    songQueue.loop = false;
    queue.delete(guild.id);
    songQueue.voice_channel.leave();
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
      if (songQueue?.songs.length > 0) {
        if (songQueue.loop) {
          songQueue.songs.push(songQueue.songs.shift());
        } else {
          songQueue.songs.shift();
        }

        videoPlayer(guild, songQueue.songs[0]?.url);
      } else {
        videoPlayer(guild, false);
        songQueue.loop = false;
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
  if (songQueue?.loop) {
    return;
  } else {
    tocandoEmbed(songQueue);
  }
};

module.exports.videoPlayer = videoPlayer;
