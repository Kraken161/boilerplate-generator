const fs = require('fs')
const ncp = require('ncp')
const path = require('path')
const { promisify } = require('util')
const { cwd } = require('process')
const shell = require('shelljs')
const axios = require('axios').default
const { exec } = require('child_process')
const execa = require('execa')
const process = require('process')

const copy = promisify(ncp)

class TemplateSettings {
	async copyFilesFromTemplate(options) {
		return copy(options.templateDirectory, options.targetDirectory, {
			clobber: false,
		})
	}

	async npmInit() {
		exec('npm init -y', (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`)
				return
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`)
				return
			}
		})
	}

	async installPackages(options) {
		if (options.type == 'discord-bot') {
			shell.exec('npm i discord.js ascii chalk@4.1.0')
		} else if (options.type == 'express') {
			shell.exec('npm i express nodemon express-ejs-layouts chalk@4.1.0')
		}
	}

	async createGitignore(options) {
		if (options.gitignore) {
			try {
				const response = await axios.get(
					`https://api.github.com/gitignore/templates/Node`
				)

				if (response?.message == 'Not Found') {
					throw new Error('Wrong language')
				}

				const data = response.data
				fs.writeFileSync(
					path.join(options.targetDirectory, '.gitignore'),
					data.source
				)
			} catch (error) {
				throw new Error(error)
			}
		}
	}

	async createLicense(options) {
		try {
			const response = await axios.get(
				`https://api.github.com/licenses/${options.license}`
			)

			if (response?.message == 'Not Found') {
				throw new Error('Wrong lincense')
			}

			const data = response.data

			const content = data.body

			fs.writeFileSync(path.join(options.targetDirectory, 'LICENSE'), content)
		} catch (error) {
			throw new Error(error)
		}
	}
}

module.exports = new TemplateSettings()
