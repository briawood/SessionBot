const Discord = require('discord.js');
const dateFormat = require('dateformat')
const fs = require('fs')

module.exports = (client, message) => {
	let salesQueueCh = client.channels.get('703332387961962637')

	let rawdata = fs.readFileSync('jsonStorageFiles/salesQueue.json')
	let salesQueue = JSON.parse(rawdata)
	let savedQueue = {}

	let saleitems = message.content.substr(message.content.indexOf(' ')+1)

	if (saleitems === '!sell') {
		message.channel.send('Please enter what you intend to sell such as a bunker and 4 mcs.').then(msg => {
			message.delete(5000)
			msg.delete(5000)
		})
		.catch(function(err) {
			console.log(err)
		})
		return
	}

	let time = new Date()
	let saleExists = false;
	for (i in salesQueue.queue) {
		if (salesQueue.queue[i].userid === message.author.id) {
			saleExists = true;
		}
	}

	if (!saleExists) {
		if (!salesQueue.queue) {
			salesQueue.queue = []
		}
		salesQueue['queue'].push ({
			userid: message.author.id,
			username: message.author.username,
			saleitems: saleitems,
			time: time,
			selling: false
		})
	}

	message.delete(5000)
	updateQueueCh(salesQueue)

	async function updateSale(user) {
		for (i in savedQueue.queue) {
			if (savedQueue.queue[i] && savedQueue.queue[i].userid === user.id) {
				if (savedQueue.queue[i].selling) {
					savedQueue.queue.splice(i,1)
				} else {
					savedQueue.queue[i].selling = true
				}
			}
		}
		updateQueueCh(savedQueue)
	}

	async function clear() {
		const fetched = await salesQueueCh.fetchMessages({limit: 99})
		salesQueueCh.bulkDelete(fetched)
	}

	async function updateQueueCh(salesQueue) {
		let msg = ''
		let ind = 1
	
		for (i in salesQueue.queue) {
			if (salesQueue.queue[i].selling) {
				msg += `\n > ${ind}. *${salesQueue.queue[i].username}*  started selling ${salesQueue.queue[i].saleitems} at ${dateFormat(salesQueue.queue[i].time, 'h:MM TT')}.`
			} else {
				msg += `\n > ${ind}. *${salesQueue.queue[i].username}*  has ${salesQueue.queue[i].saleitems} to sell.`
			}
			ind++
		}
	
		if (ind === 1) {
			msg = '\nSales queue is empty.'
		}
	
		let embed = new Discord.RichEmbed()
		.setTitle("Sales Queue")
		.setColor(0x451a96)
		.setDescription(msg)
		.setFooter("Click the cash bag below when you begin your sale, and again when you are finished.")

		await salesQueueCh.fetchMessages({around: salesQueue.messageId, limit: 1})
		.then(msg => {
			const fetchedMsg = msg.first()
			if (fetchedMsg) {
				fetchedMsg.edit(embed)
				saveQueue(salesQueue)
			} else {
				clear(),
				salesQueueMsg = salesQueueCh.send(embed).then(msg => {
					if (ind > 1) {
						msg.react('💰')
					}
					salesQueue.messageId = msg.id
					saveQueue(salesQueue)
				})
				.catch(function(err) {
					console.log(err)
				})	
			}
		})
		.catch(function(err) {
			console.log(err)
		})
	}

	async function saveQueue(salesQueue) {
		let data = JSON.stringify(salesQueue, null, 4);
		fs.writeFile('jsonStorageFiles/salesQueue.json', data, (err) => {
			if (err) throw err;
		})
		savedQueue = salesQueue
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

	client.on('raw', packet => {
		if (packet.t != 'MESSAGE_REACTION_REMOVE') return
		salesQueueCh.fetchMessage(packet.d.message_id).then(message => {
			const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name
			const reaction = message.reactions.get(emoji)
			if (reaction) reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id))
			if (packet.t === 'MESSAGE_REACTION_REMOVE') {
				client.emit('messageReactionRemove', reaction, client.users.get(packet.d.user_id))
			}
		})
	})
}