const kick = require("../commands/kick")
const sell = require("../commands/sell")

module.exports = (client, message) => {
	if (message.content.substring(0, 1) === '!') {
		if (message.content.substring(0, 5) === "!kick") {
			return kick(message)
		}
		if (message.content.substring(0, 5) === "!sell") {
			return sell(client, message)
		}
	}
}