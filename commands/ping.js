module.exports = {
  name: "ping",
  cooldown: 60,
  description: "This is a ping(pong) command",
  execute(message, args) {
    message.channel.send("pong");
  },
};
