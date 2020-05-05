module.exports = (message) => {
	let res = message.content.split(' ')
	let msg = 'Please vote to kick **' + (res[1] || '') + '** and confirm by clicking the boot.'
	message.channel.send(msg).then(function (reply) {
    	reply.react(':boot:')
    	message.delete()
	}).catch(function(err) {
		console.log(err)
	})
}