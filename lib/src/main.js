const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
import { projectInstall } from 'pkg-install'
const TemplateSettings = require('./settings/settings')
const { cwd } = require('process')

const access = promisify(fs.access)

class MainFunction {
	async createProject(options) {
		options = {
			...options,
			targetDirectory: options.targetDirectory || process.cwd(),
			fullName: 'Your name.',
		}

		const fullPathName = cwd()
		const templateDir = path.join(
			fullPathName + '/templates',
			options.type.toLowerCase()
		)

		options.templateDirectory = templateDir

		try {
			await access(templateDir)
		} catch (err) {
			console.error('%s Invalid template name', chalk.red.bold('ERROR'))
			process.exit(1)
		}

		const tasks = require('./tasks/manager')([
			{
				title: 'Copy project files',
				task: () => TemplateSettings.copyFilesFromTemplate(options),
			},
			{
				title: 'Create gitignore',
				task: () => TemplateSettings.createGitignore(options),
			},
			{
				title: 'Create License',
				task: () => TemplateSettings.createLicense(options),
			},
			{
				title: 'Create package.json',
				task: () => TemplateSettings.npmInit(options),
			},
			{
				title: 'Install dependencies',
				task: () =>
					projectInstall({
						cwd: options.targetDirectory,
					}),
			},
		])

		tasks.run()

		console.log('%s Project ready', chalk.green.bold('DONE'))
		return true
	}
}

module.exports = new MainFunction()
