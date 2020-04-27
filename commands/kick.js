module.exports = (message, name) => {
//    var msg = "@here Please vote to kick " + (res[1] || "") + " and confirm by clicking the boot."
    var msg = "Please vote to kick " + (name || "") + " and confirm by clicking the boot."
    message.channel.send(msg).then(function (reply) {
      reply.react("👢")
      message.delete()
    }).catch(function() {
      //Something
    })
}