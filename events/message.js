const kick = require('../commands/kick')
const sell = require('../commands/sell')
const help = require('../commands/help')

module.exports = (client, message) => {
	if (message.content.substring(0, 1) === '!') {
		if (message.content.substring(0, 5) === '!kick') {
			return kick(message)
		}
		if (message.content.substring(0, 5) === '!sell') {
			return sell(client, message)
		}
		if (message.content.substring(0, 5) === '!help') {
			return help(message)
		}
	}
}