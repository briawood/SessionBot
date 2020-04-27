module.exports = (client, message) => {
	console.log(message);
	console.log(message.author.username);
	var salesQueue = salesQueue || {};
	var msg = "Selling something"
	message.channel.send(msg).then(function (reply) {
//		reply.react("👢")
        message.delete()
	}).catch(function() {
		//Something
	})
}