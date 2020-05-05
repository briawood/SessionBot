const dateFormat = require('dateformat')
const fs = require('fs')

module.exports = (client, message) => {
	let salesQueueCh = client.channels.get('703332387961962637')

	let rawdata = fs.readFileSync('jsonStorageFiles/salesQueue.json')
	let salesQueue = JSON.parse(rawdata) || {}
	let savedQueue = {}

	let saleitems = message.content.substr(message.content.indexOf(' ')+1)

	if (saleitems === '!sell') {
		message.channel.send('ay you fuckin tard you gotta say what you\'re selling').then(msg => {
			msg.delete(5000)
		})
		.catch(function(err) {
			console.log(err)
		})
	}

//	let time = dateFormat(new Date(), 'h:MM:ss')
	let time = new Date()

	let index = 0
	let saleExists = false;
	for (i in salesQueue) {
		if (salesQueue[i].userid === message.author.id) {
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

	message.delete(5000)
	updateQueueCh(salesQueue)
	saveQueue(salesQueue)

	async function updateSale(user) {
		savedQueue = JSON.parse(savedQueue)
		for (i in savedQueue) {
			if (savedQueue[i] && savedQueue[i].userid === user.id) {
				if (savedQueue[i].selling) {
					let filtered = Object.values(savedQueue).filter(function(value, index, arr){ return index != i })
					savedQueue = filtered
				} else {
					savedQueue[i].selling = true
				}
			}
		}
		updateQueueCh(savedQueue)
		saveQueue(savedQueue)
	}

	async function clear() {
		const fetched = await salesQueueCh.fetchMessages({limit: 99})
		salesQueueCh.bulkDelete(fetched)
	}

	async function updateQueueCh(salesQueue) {
		clear()

		let msg = '**Sales Queue**'
		let ind = 1
	
		for (i in salesQueue) {
			if (salesQueue[i].selling) {
				msg += `\n > ${ind}. *${salesQueue[i].username}*  started selling ${salesQueue[i].saleitems} at ${dateFormat(salesQueue[i].time, 'h:MM TT')}.`
			} else {
				msg += `\n > ${ind}. *${salesQueue[i].username}*  has ${salesQueue[i].saleitems} to sell.`
			}
			ind++
		}
	
		if (ind > 1) {
			msg += '\n\nClick the cash bag below when you begin your sale, and again when you are finished.'
		} else {
			msg += '\nSales queue is empty.'
		}
	
		salesQueueCh.send(msg).then(function (queueText) {
			if (ind > 1) {
				queueText.react('💰')			
			}
		}).catch(function(err) {
			console.log(err)
		})
	}

	async function saveQueue(salesQueue) {
		let data = JSON.stringify(salesQueue, null, 4);
		fs.writeFile('jsonStorageFiles/salesQueue.json', data, (err) => {
			if (err) throw err;
		})
		savedQueue = data
	}

	function toLocalTime(time) {
		var d = new Date(time)
		var offset = (new Date().getTimezoneOffset() / 60) * -1
		var n = new Date(d.getTime() + offset)
		return n
	}

	client.on('messageReactionAdd', (reaction, user) => {
		if (reaction.emoji.name === '💰' && user.username !== 'SessionBot') {
			updateSale(user)
		}
	})
	
	client.on('messageReactionRemove', (reaction, user) => {
		if (reaction.emoji.name === '💰' && user.username !== 'SessionBot') {
			updateSale(user)
		}
	})
}