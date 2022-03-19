const fs = require('fs')
const ncp = require('ncp')
const path = require('path')
const { promisify } = require('util')
const { cwd } = require('process')
const shell = require('shelljs')
const axios = require('axios').default

const copy = promisify(ncp)

class TemplateSettings {
	async copyFilesFromTemplate(options) {
		return copy(options.templateDirectory, options.targetDirectory, {
			clobber: false,
		})
	}

	async npmInit() {
		return shell.exec('npm init -y -f')
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

			const content = data.source

			fs.writeFileSync(
				path.join(options.targetDirectory, 'LICENSE'),
				content.toString()
			)
		} catch (error) {
			throw new Error(error)
		}
	}
}

module.exports = new TemplateSettings()
