const { adicionadoNaQueueEmbed } = require("./embedMessage");
const { videoFinder } = require("./videoFinder");
const { songRequestVerification } = require("./songRequestVerification");
const { videoPlayer } = require("./videoPlayer");
const { queue } = require("./queueMap");

module.exports = {
  name: "play",
  aliases: "p",
  description: "Plays music",
  async execute(message, args) {
    // Necessary variables
    const serverQueue = await queue.get(message.guild.id);
    const voiceChannel = await message.member.voice.channel;
    const botChannel = await message.guild.me.voice.channel;
    const permissions = voiceChannel.permissionsFor(message.client.user);

    // Simple verifications
    if (!voiceChannel)
      return message.channel.send(
        "Tem que ta numa call pra usar o comando PORRA 🤦‍♂️"
      );
    if (botChannel && botChannel !== voiceChannel)
      return message.channel.send("Tem que ta na msm call q o bot pra usar 😑");
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
    //

    const video = await videoFinder(args.join(" "));

    if (!video) return message.channel.send("Achei nada não man 😕");

    let song = songRequestVerification(video, message, args);

    // If the server didn't already have a queue it will create one and if it
    // has it will add the music to the queue
    if (!serverQueue) {
      const queueConstructor = {
        voice_channel: voiceChannel,
        text_channel: message.channel,
        connection: null,
        songs: [],
        loop: false,
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
      //
    } else {
      serverQueue.songs = serverQueue.songs.concat(song);
      adicionadoNaQueueEmbed(serverQueue);
    }
    //
  },
};
