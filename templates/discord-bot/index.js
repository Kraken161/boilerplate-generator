const { Client, Intents } = require('discord.js')
const { token } = require('./config.json')
const chalk = require('chalk')
const ascii = require('ascii')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.commands = new Collection()
client.cooldowns = new Collection()

//event handler
const table1 = new ascii().setHeading('Events', 'Load status')

const eventFiles = fs
	.readdirSync('./events')
	.filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
	const event = require(`./events/${file}`)
	if (event.once) {
		table1.addRow(file, '✅')
		client.once(event.name, (...args) => event.execute(...args, client))
	} else {
		table1.addRow(file, '✅')
		client.on(
			event.name,
			async (...args) => await event.execute(...args, client)
		)
	}
}

console.log(table1.toString())

//command handlers
const commandFolders = fs.readdirSync('./commands')

const table = new ascii().setHeading('Commands', 'Load status')

for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter((file) => file.endsWith('.js'))

	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`)
		table.addRow(file, '✅')
		client.commands.set(command.name, command)
	}
}

client.once('ready', () => {
	console.log(chalk.bold.green('Ready!'))
})

client.login(token)
