require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const cookieSession = require('cookie-session')
const passport = require('passport')
const { initServer } = require('./db/dbConnect')
const tasks = require('./routers/tasks')
const auth = require('./routers/auth')
const sampleuser = require('./routers/sampleuser')
const { COOKIE_SECRET, PORT } = process.env

require('./passport')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(cookieSession({
  resave: true, 
  maxAge: 30*24*60*60*1000,
  secret: COOKIE_SECRET }))
app.use(passport.initialize())
app.use(passport.session())

initServer(() => app.listen(PORT, () => console.log(`listening on port: ${PORT}`)))

app.use(auth)
app.use(tasks)
app.use(sampleuser)

app.use(express.static(__dirname + '/../frontend/build'))
app.get('/*', (req, res) => res.redirect('/'))