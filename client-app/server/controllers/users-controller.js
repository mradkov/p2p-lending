module.exports = {
    lend: (req, res) => {
        res.render('users/lend')
    },
    borrow: (req, res) => {
        res.render('users/borrow')
    },
    profile: (req, res) => {
        res.render('users/profile')
    },
    checkAddress: (req, res) => {
        res.render('users/check', {address: req.query.address})
    }
}