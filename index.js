let env = process.env.NODE_ENV || 'development'
let settings = require('./server/config/settings')[env]

const app = require('express')()

require('./server/config/express')(app)
require('./server/config/routes')(app)

app.listen(settings.port)
console.log(`Server listening on port ${settings.port}...`)