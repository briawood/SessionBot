module.exports = (message, name) => {
    var msg = "Selling **" + (name || "") + "**"
    message.channel.send(msg).then(function (reply) {
//      reply.react("👢")
      message.delete()
    }).catch(function() {
      //Something
    })
  }