const Listr = require('listr')

module.exports = (tasks) => {
	return new Listr(tasks, {
		exitOnError: false,
	})
}
