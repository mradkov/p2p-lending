const globalAlert = require('../utilities/alerts')
const moment = require('moment');

module.exports = {
    lend: (req, res) => {
        res.render('users/lend')
    },
    borrow: (req, res) => {
        res.render('users/borrow')
    },
    profile: (req, res) => {
        res.render('users/profile')
    }
}