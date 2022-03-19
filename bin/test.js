#! /usr/bin/env node
require = require('esm')(module)
require('./cli/cli').cli(process.argv)
