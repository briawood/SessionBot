const kick = require("../commands/kick")

module.exports = (client, message) => {
    var res = message.content.split(" ")
    if (res[0] === "!kick") {
        return kick(message, res[1])
    }
    if (res[0] === "!sell") {
  //    message.guild.channel.get("703332387961962637").send("Message")
  //    bot.guilds.get('689154684380119069').channels.get('703332387961962637').send("Hello World!")
    }
}