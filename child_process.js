const chalk = require('chalk')

module.exports = {
	async execChildProcess(process) {
		const util = require('util')
		const exec = util.promisify(require('child_process').exec)

		const { stdout, stderr } = await exec(process)
		console.log('stdout:', stdout)
		console.log('stderr:', stderr)

		return stdout
	},

	async installNpm(process) {
		const util = require('util')
		const exec = util.promisify(require('child_process').exec)

		if (process.length > 0) {
			console.log(chalk.bold.blue(`Packages download has started`))
			process.forEach(async (element) => {
				const { stdout, stderr } = await exec(`npm i ${element}`)

				console.log(stdout)

				console.log(
					chalk.bold.green(`${element.toUpperCase()} has been downloaded`)
				)

				return stdout
			})
		} else if (process.length == 0) {
			console.log(
				chalk.bold.blue(`${element.toUpperCase()} download has started`)
			)

			const { stdout, stderr } = await exec(`npm i ${element}`)

			console.log(stdout)

			console.log(
				chalk.bold.green('Successfuly created boilerplate directory!')
			)

			console.log(
				chalk.bold.green(`${element.toUpperCase()} has been downloaded`)
			)

			return stdout
		}
	},

	async npmInit() {
		const util = require('util')
		const exec = util.promisify(require('child_process').exec)

		console.log(chalk.bold.blue(`Package.json creating has started`))
		try {
			const { stdout, stderr } = await exec(`npm init -y`)

			console.log(stdout)
		} catch (error) {
			throw new Error('Error occurred while creating package.json file')
		}
	},
}
