module.exports = (message) => {
	let res = message.content.split(' ')
	let msg = 'Please vote to kick **' + (res[1] || '') + '** and confirm by clicking the boot.'
	message.channel.send(msg).then(msg => {
		msg.react('👢')
		message.delete()
		msg.delete(900000)
	}).catch(function(err) {
		console.log(err)
	})
}