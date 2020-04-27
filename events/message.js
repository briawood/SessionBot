const kick = require("../commands/kick")
const sell = require("../commands/sell")

module.exports = (client, message) => {
	if (message.content.substring(0, 1) == '!') {
		var res = message.content.split(" ")
		if (res[0] === "!kick") {
			return kick(message, res[1])
		}
		if (res[0] === "!sell") {
			return sell(client, message)
		}
	}
}