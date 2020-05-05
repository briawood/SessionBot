module.exports = (message) => {
    let msg = '> !kick - Send message to chat to kick a random with a boot emoji reaction.' +
    '\n> !sell - Enter your sale into sales queue.'
	message.channel.send(msg).then(function (reply) {
    	message.delete()
	}).catch(function(err) {
		console.log(err)
	})
}