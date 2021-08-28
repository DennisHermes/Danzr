module.exports.run = async (bot, message, args) => {
    return message.channel.send('pong');
}

module.exports.info = {
    name: "ping"
}