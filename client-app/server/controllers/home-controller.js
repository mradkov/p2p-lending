// const mongoose = require('mongoose')
// const User = mongoose.model('User')
module.exports = {
    index: (req, res) => {
        res.render('home/index')
    },
    about: (req, res) => {
        res.render('home/about')
    }
}