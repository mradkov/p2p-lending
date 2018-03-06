// const mongoose = require('mongoose')
// const User = mongoose.model('User')
const globalAlert = require('../utilities/alerts')
const moment = require('moment');
// const Chat = mongoose.model('Chat')

module.exports = {
    index: (req, res) => {
        res.render('home/index')
    },
    about: (req, res) => {
        res.render('home/about')
    }
}