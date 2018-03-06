const controllers = require('../controllers')

module.exports = (app) => {
    app.get('/', controllers.home.index)
    app.get('/about', controllers.home.about)
    app.get('/lend', controllers.user.lend)
    app.get('/borrow', controllers.user.borrow)
    app.get('/profile', controllers.user.profile)

    // app.get('/users/register', controllers.users.registerGet)
    // app.post('/users/register', controllers.users.registerPost)
    // app.get('/users/login', controllers.users.loginGet)
    // app.post('/users/login', controllers.users.loginPost)
    // app.post('/users/logout', controllers.users.logout)

    // app.get('/users/block', auth.isAuthenticated, controllers.users.blockGet)
    // app.post('/users/block/:username', auth.isAuthenticated, controllers.users.blockPost)

    // app.post('/search', auth.isAuthenticated, controllers.users.searchGet)

    // app.get('/thread', auth.isAuthenticated, controllers.chats.chatWithGet)
    // app.get('/thread/:username', auth.isAuthenticated, controllers.chats.chatWithGet)
    // app.post('/thread/:username', auth.isAuthenticated, controllers.chats.chatWithPost)

    // app.post('/message/like/:id/:receiver', auth.isAuthenticated, controllers.chats.messageReaction)
    
    app.all('*', (req, res) => {
        res.status(404)
        res.send('404 Not Found!')
        res.end()
    })
}