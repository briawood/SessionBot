const dateFormat = require('dateformat')
const fs = require('fs')

module.exports = (client, message) => {
	let salesQueueCh = client.channels.get('703332387961962637')

	let rawdata = fs.readFileSync('salesQueue.json')
	let salesQueue = rawdata.length > 0 ? JSON.parse(rawdata) : {}

	let saleitems = message.content.substr(message.content.indexOf(' ')+1)

	let time = dateFormat(new Date(), 'h:MM:ss')

	let index = 0
	let saleExists = false;
	for (i in salesQueue) {
		if (salesQueue[i].userid == message.author.id) {
			salesQueue[i] = {
				userid: message.author.id,
				username: message.author.username,
				saleitems: saleitems,
				time: time,
				selling: false
			}
			saleExists = true;
		}
		index++
	}

	if (!saleExists) {
		salesQueue[index] = {
			userid: message.author.id,
			username: message.author.username,
			saleitems: saleitems,
			time: time,
			selling: false
		}
	}

	updateQueueCh()

	async function clear() {
		const fetched = await salesQueueCh.fetchMessages({limit: 99})
		salesQueueCh.bulkDelete(fetched)
	}

	async function updateQueueCh() {
		clear()

		let msg = '**Sales Queue**'
		let ind = 1
	
		for (sale in salesQueue) {
			msg += `\n > ${ind}. *${salesQueue[sale].username}*  has ${salesQueue[sale].saleitems} to sell.`
			ind++
		}
	
		msg += '\n\nClick the cash bag below when you begin your sale, and again when you are finished.'
	
		salesQueueCh.send(msg).then(function (reply) {
			message.delete()
			reply.react('💰')
		}).catch(function(err) {
			console.log(err)
		})
	}

	async function saveQueue() {
		let data = JSON.stringify(salesQueue, null, 4);
		fs.writeFile('salesQueue.json', data, (err) => {
			if (err) throw err;
			console.log('Data written to file');
		});
	}

	client.on('messageReactionAdd', (reaction, user) => {
		let message = reaction.message, emoji = reaction.emoji
		if (emoji.name == '💰') {
			message.guild.fetchMember(user.id).then(member => {
				console.log(user.username)
			})
		}
	})
}