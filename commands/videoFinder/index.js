const ytdl = require("ytdl-core");
const ytpl = require("ytpl");
const ytSearch = require("ytSearchVelleda");

const regYoutubePlaylist = /[?&]list=([^#\&\?]+)/;
const regYoutubeLink =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

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

module.exports.videoFinder = videoFinder;
