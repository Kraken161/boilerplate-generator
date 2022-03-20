module.exports = {
	name: 'ping',
	guild: true,

	execute(message, args) {
		message.channel.send({
			content: `:ping_pong: Pong! My ping is: ${message.client.ws.ping}ms`,
		})
	},
}
