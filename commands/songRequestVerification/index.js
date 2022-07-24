const ytdl = require("ytdl-core");

const regYoutubePlaylist = /[?&]list=([^#\&\?]+)/;

// If the argument received is a playlist it will set all the videos to a
// playlist with the queue format, if it is unique video it will simply set to
// the queue format and if it was the text name of a music it will also set it
// to the queue format
const songRequestVerification = (video, message, args) => {
  if (String(args).match(regYoutubePlaylist)) {
    song = [];
    var playlist = video;
    for (let i = 0; playlist.items.length > i; i++) {
      playlistSongs = {
        index: playlist.items[i].index,
        title: playlist.items[i].title,
        url: playlist.items[i].shortUrl,
        videoLength: ssTohms(hmsToSecondsOnly(playlist.items[i].duration)),
        seconds: playlist.items[i].durationSec,
        thumbnail: playlist.items[i].thumbnails[0].url,
        author: playlist.items[i].author.name,
        userRequested: message.author.toString(),
      };
      song.push(playlistSongs);
    }

    return song;
  } else if (ytdl.validateURL(video.videoDetails?.video_url)) {
    song = {
      title: video.videoDetails.title,
      url: video.videoDetails.video_url,
      videoLength: ssTohms(video.videoDetails.lengthSeconds),
      seconds: video.videoDetails.lengthSeconds,
      thumbnail: video.videoDetails.thumbnails[0].url,
      author: video.videoDetails.author.name,
      userRequested: message.author.toString(),
    };

    return song;
  } else {
    song = {
      title: video.title,
      url: video.url,
      videoLength: ssTohms(hmsToSecondsOnly(video.duration_raw)),
      seconds: hmsToSecondsOnly(video.duration_raw),
      thumbnail: video.snippet.thumbnails.url,
      author: video.author,
      userRequested: message.author.toString(),
    };

    return song;
  }
};

module.exports.songRequestVerification = songRequestVerification;

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