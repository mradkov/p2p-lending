const express = require('express')
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const helpers = require('handlebars-helpers')()

module.exports = (app) => {
    
    app.engine('handlebars', handlebars({
        defaultLayout: 'main'
    }))
    app.set('view engine', 'handlebars')

    app.use(bodyParser.urlencoded({ extended: true }))

    app.use(express.static('public'))

    console.log('Express ready!')
}