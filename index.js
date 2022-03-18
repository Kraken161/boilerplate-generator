const NodeBoilerPlate = require('./types/express/node-boilerplate')
const { execChildProcess, installNpm } = require('./child_process')
const yargs = require('yargs')

const argv = yargs
	.command('generate', 'Generates boilerplate.', {
		generate: {
			description: 'Boilerplate',
			alias: 'gen',
			type: 'string',
		},
	})
	.option('express', {
		alias: 'node',
		description: 'Nodejs boilerplate',
		type: 'boolean',
	})
	.help()
	.alias('help', 'h').argv

if (argv._.includes('generate')) {
	if (argv.express) {
		NodeBoilerPlate.createNodeBoilerplate()
	}
}
