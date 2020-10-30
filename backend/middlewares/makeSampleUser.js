const { ObjectId } = require('mongodb')
const { getDb } = require('../db/dbConnect')
const { v4: uuidv4 } = require('uuid')

const makeTemp = async () => {
  try {
      const db = getDb()
      const startTime = Date.now()
      const user = { userId: uuidv4(), displayName: 'Sample User', sample: true, startTime }
      const { ops } = await db.collection('users').insertOne(user)
      const [{_id}] = ops
      const sampleTasks = [
        { title: "Sample Task #1", sample: true, startTime, done: true, user: ObjectId(_id) },
        { title: "Sample Task #2", sample: true, startTime, done: false, user: ObjectId(_id) },
        { title: "Sample Task #3", sample: true, startTime, done: true, user: ObjectId(_id) },
        { title: "Sample Task #4", sample: true, startTime, done: false, user: ObjectId(_id) },
      ]
      sampleTasks.map(async task => await db.collection('tasks').insertOne(task))
      return { _id, startTime }
    } catch (e) {
      console.log(e);
    }
}

module.exports = async (req, res, next) => {
  if(!req.session.user && !req.user) {
    console.log('Middleware - if(!req.session.user)')
    req.session.user = await makeTemp()
    console.log('setting user ID in middleware - req.session.user: ', req.session.user);
  } else {
    console.log('has temp session:', req.session.user);
    console.log('has user session:', req.user);
    if(req.session.user) {
      // if((Date.now() - 2*60*1000) > req.session.user.startTime) {
      if((Date.now() - 15*1000) > req.session.user.startTime) {
        console.log('expiring/deleting');
        delete req.session.user
        console.log('making fresh temp user');
        req.session.user = await makeTemp()
        console.log('setting user ID in middleware - req.session.user: ', req.session.user);
      }
    }
  }

  next();
};
