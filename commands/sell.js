var dateFormat = require('dateformat')

module.exports = (client, message) => {
	var salesQueueCh = client.channels.get('703332387961962637')
	var salesQueue = salesQueue || []

	var saleitems = message.content.substr(message.content.indexOf(' ')+1)

	var time = dateFormat(new Date(), "h:MM:ss")

	salesQueue[message.author.id] = {
		username: message.author.username,
		saleitems: saleitems,
		time: time,
		selling: false
	}

//	console.log(salesQueue)

	var msg = "selling something"
	var ind = 1

	for (userId in salesQueue) {
		msg = "\n\n" + ind + ". " + salesQueue[userId].username + " has " + 
		salesQueue[userId].saleitems + " to sell." +
		"\n\nClick the checkmark below when you begin your sale."
		ind++
	}

	async function clear() {
		const fetched = await salesQueueCh.fetchMessages({limit: 99});
		salesQueueCh.bulkDelete(fetched);
	}
	clear();

	salesQueueCh.send(msg).then(function (reply) {
		reply.react("✅")
		message.delete()

		const filter = (reaction, user) => {
			return reaction.emoji.name === '✅'
		}
		
		reply.awaitReactions(filter)
			.then(collected => console.log(collected.size))
			.catch(collected => {
				console.log(`After a minute, only ${collected.size} out of 4 reacted.`)
		})	
	}).catch(function(err) {
		console.log(err)
	})
}