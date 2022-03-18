const { installNpm, npmInit } = require('../../child_process')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const directoryPath = path.join(__dirname, '../../boilerplates/express-tosave')
const { cwd } = require('process')

class NodeBoilerPlate {
	async createNodeBoilerplate() {
		try {
			npmInit()

			installNpm(['express', 'express-ejs-layouts'])

			fs.readdir(directoryPath, function (err, files) {
				if (err) {
					throw new Error('Unable to scan directory: ' + err)
				}

				files.forEach(function (file) {
					const data = fs.readFileSync(`${directoryPath}/${file}`, {
						encoding: 'utf8',
						flag: 'r',
					})

					const dir = path.join(cwd())

					if (!fs.existsSync(dir)) {
						fs.mkdirSync(dir, {
							recursive: true,
						})
					}

					const dirPath = path.join(`${dir}`)

					fs.writeFileSync(`${dirPath}/${file}`, data, { flag: 'a+' })
				})

				const publicFolderPath = path.join(cwd())

				fs.mkdirSync(publicFolderPath + '/' + 'public', {
					recursive: true,
				})

				const nextFolders = path.join(cwd() + '/' + 'public')

				fs.mkdirSync(nextFolders + '/' + 'js', {
					recursive: true,
				})

				fs.mkdirSync(nextFolders + '/' + 'styles', {
					recursive: true,
				})

				fs.mkdirSync(nextFolders + '/' + 'images', {
					recursive: true,
				})
			})
			setTimeout(() => {
				console.log(
					chalk.bold.green('Successfuly created boilerplate directory!')
				)
			}, 7000)
		} catch (error) {
			throw new Error(error.message)
		}
	}
}

module.exports = new NodeBoilerPlate()
