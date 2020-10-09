const { MongoClient } = require('mongodb')
require('dotenv').config()

let db

const initServer = (serverStart) => {
  MongoClient.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, })
    .catch(err => {
      return console.error(err)
    })
    .then(client => {
      db = client.db('tasks-todo-2')
      return serverStart()
    })
}

const getDb = () => {
  return db
}
module.exports = {
  initServer,
  getDb
}