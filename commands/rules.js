module.exports = {
  name: "rules",
  aliases: ["commands", "command", "rule"],
  cooldown: 120,
  description: "This is a rules command",
  execute(message, args, Discord) {
    const newEmbed = new Discord.MessageEmbed()
      .setColor("#000")
      .setTitle("Rules")
      .setURL("https://www.youtube.com/watch?v=aUnTuRnML5Y")
      .setDescription("Sigma Male Grindset")
      .addFields(
        { name: "Rule 1", value: "First rule is to break the rules" },
        { name: "Rule 2", value: "Never regret of what has happened" },
        { name: "Rule 3", value: "Don't dream of the future" },
        { name: "Rule 4", value: "Mind your own business" },
        { name: "Rule 5", value: "Focus more on listening than talking" },
        { name: "Rule 6", value: "You are the first priority of your life" },
        {
          name: "Rule 7",
          value: "Be the man of words but remain flexible with your actions",
        },
        {
          name: "Rule 8",
          value:
            "Always be yourself, don't listen to what others say about you",
        },
        {
          name: "Rule 9",
          value:
            "If a person doesn't respects you, do the same without getting mad",
        },
        {
          name: "Rule 10",
          value:
            "Don't be mad after womens, and don't let their presence affect your behaviour",
        },
        { name: "Rule 11", value: "Work smart, Not hard" },
        { name: "Rule 12", value: "Show your power only when it's necessary" },
        {
          name: "Rule 13",
          value:
            "Promote Human Equality, see everyone equality irrespective of their class, standard and gender",
        },
        {
          name: "Rule 14",
          value: "Have courage to be stand alone in any situation",
        },
        { name: "Rule 15", value: "Attitude speaks more than words" }
      )
      .setImage(
        "https://c.tenor.com/4QhrOhsW8AoAAAAd/sigma-male-grindset-grindset.gif"
      )
      .setFooter(
        "Whosoever is delighted in their own solitude is either a wild beast or a god - Aristotle"
      );
    message.channel.send(newEmbed);
  },
};
