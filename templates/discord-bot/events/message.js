const { Collection } = require('discord.js')
const config = require('../config.json')
const { MessageEmbed } = require('discord.js')

const escapeRegex = (string) => {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

module.exports = {
	name: 'messageCreate',

	async execute(message) {
		const { author, guild, channel } = message

		if (author.bot) {
			return
		}

		let prefix = config.prefix

		if (!message.content.startsWith(prefix)) return

		const args = message.content.slice(matchedPrefix.length).trim().split(/ +/)

		const cmdName = args.shift().toLowerCase()

		const command =
			client.commands.get(commandName) ||
			client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
			)

		if (!command) return

		if (command.guild && !guild) {
			return message.reply('this command can only be run on the server')
		}

		if (command.owner) {
			if (author.id !== config.ownerId) {
				return message.reply('only the bot owner can execute this command.')
			}
		}

		if (command.permissions) {
			const authorPerms = message.channel.permissionsFor(message.author)
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				return message.reply('only the bot owner can execute this command.')
			}
		}

		const { cooldowns } = client

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection())
		}

		const now = Date.now()
		const timestamps = cooldowns.get(cmdName)
		const cooldownAmount = (command.cooldown || 3) * 1000

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000
				return message.reply(
					`please wait ${timeLeft.toFixed(
						1
					)} more second(s) before executing the \`${cmdName}\` command.`
				)
			}
		}

		timestamps.set(message.author.id, now)
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

		try {
			command.execute(message, args)
		} catch (error) {
			console.error(error)
			message.reply('there was an error trying to execute that command!')
		}
	},
}
