const { MongoClient } = require('mongodb')
const { ObjectId } = require('mongodb')

let db

const deleteSample = async database => {
  const checkTime = Date.now()
  const expiration = 15*1000
  try {
    const users = await database.collection('users').find({ sample: true }).toArray()
    // const toDelete = users.filter(user => (Date.now() - user.startTime) > 2*60*1000)
    const toDelete = users.filter(user => checkTime - user.startTime > expiration)
    toDelete.map( async user => {
      console.log('user: ', user);
      await database.collection('users').deleteOne({ _id: ObjectId(user._id) })
    })
    // const { ops } = await database.collection('tasks').deleteMany({ sample: true, startTime: { $gt: (Date.now() - 2*60*1000) } })
    // const { ops } = await database.collection('tasks').deleteMany({})
    await database.collection('tasks').deleteMany({ sample: true, startTime: { $lt: checkTime - expiration } })
    
  } catch (e) {
    console.log(e)
  }
  setTimeout(() => deleteSample(database), 5000)
}

const initServer = (serverStart) => {
  MongoClient.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, })
    .catch(err => {
      return console.error(err)
    })
    .then(client => {
      db = client.db('tasks-todo-2')
      serverStart()
      deleteSample(db)
    })
}

const getDb = () => {
  return db
}

module.exports = {
  initServer,
  getDb
}