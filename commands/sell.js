const dateFormat = require('dateformat')
const fs = require('fs')

module.exports = (client, message) => {
	let salesQueueCh = client.channels.get('703332387961962637')

	let rawdata = fs.readFileSync('jsonStorageFiles/salesQueue.json')
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

	message.delete()
	updateQueueCh(salesQueue)
	saveQueue(salesQueue)

	async function updateSale(user) {
		let rawdata = fs.readFileSync('jsonStorageFiles/salesQueue.json')
		let savedQueue = JSON.parse(rawdata)
		for (i in savedQueue) {
			if (savedQueue[i].userid == user.id) {
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
				msg += `\n > ${ind}. *${salesQueue[i].username}*  is selling ${salesQueue[i].saleitems}.`
			} else {
				msg += `\n > ${ind}. *${salesQueue[i].username}*  has ${salesQueue[i].saleitems} to sell.`
			}
			ind++
		}
	
		if (salesQueue.length > 0) {
			msg += '\n\nClick the cash bag below when you begin your sale, and again when you are finished.'
		} else {
			msg += '\nSales queue is empty.'
		}
	
		salesQueueCh.send(msg).then(function (queueText) {
			if (salesQueue.length > 0) {
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
		});
	}

	client.on('messageReactionAdd', (reaction, user) => {
		let message = reaction.message, emoji = reaction.emoji
		if (emoji.name == '💰' && user.username != 'SessionBot') {
			updateSale(user)
		}
	})
}