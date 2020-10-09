const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const { initServer } = require('./db/dbConnect')
const tasksApi = require('./routers/tasks')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT

initServer(() => app.listen(port, () => console.log(`listening on port: ${port}`)))

app.use(tasksApi)

app.use(express.static(__dirname + '/../frontend/build'))
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))