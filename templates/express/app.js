const express = require('express')
const ejsLayouts = require('express-ejs-layouts')

const app = express()

//view engine
app.set('view engine', 'ejs')

//ejs layout
app.use(ejsLayouts)
app.set('layout', './layouts/main')

//body parser
app.use(express.urlencoded({ extended: true }))

//public folder
app.use(express.static('public'))

module.exports = app
