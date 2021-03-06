const express = require('express')
const router = new express.Router()
const { ObjectId } = require('mongodb')
const { getDb } = require('../db/dbConnect')
const { checkCache, setCache } = require('../db/caching')
const requireLogin = require('../middlewares/requireLogin')
const cleanCache = require('../middlewares/cleanCache')

// get all tasks
router.get('/api/v1/tasks', requireLogin, async (req, res) => {
  console.log('get all')
  const collection = 'tasks'
  const query = { user: ObjectId(req.user._id) }
  const key = { collection, query }

  const cachedTasks = await checkCache(key, req.user._id)
  if(cachedTasks) return res.status(201).send(cachedTasks)

  setTimeout(async () => {
    console.log('mongo')
    try {
      const db = getDb()
      const tasks = await db.collection(collection).find(query).toArray()
      res.status(201).send(tasks)
      setCache(key, tasks, req.user._id)
    } catch (e) {
      console.log(e)
      res.status(500).send(e)
    }
  }, 500)
})

//get one task
router.get('/api/v1/tasks/:id', requireLogin,  async (req, res) => {
  console.log('get one')
  try {
    const taskID = req.params.id
    const db = getDb()
    const task = await db.collection('tasks').findOne({ user: ObjectId(req.user._id),  _id: ObjectId(taskID) })
    res.status(201).send(task)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

//add one task
router.post('/api/v1/tasks', requireLogin, cleanCache, async (req, res) => {
  console.log('get add one')
  try {
    const db = getDb()
    await db.collection('tasks').insertOne({ ...req.body, user: ObjectId(req.user._id) })
    const tasks = await db.collection('tasks').find({ user: ObjectId(req.user._id) }).toArray()
    res.status(201).send(tasks)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

//update one or many tasks
router.put('/api/v1/tasks', requireLogin, cleanCache, async (req, res) => {
  console.log('req.body: ', req.body);
  const db = getDb()
  const { search, change } = req.body
  const update = {$set: change }

  //check if single update or multiple
  if(Object.keys(search).length === 0) {
    console.log('update several')
    //check if array for several different updates
    if(Array.isArray(change)) {
      Promise.all(
        change.map(async ({_id, title}) => {
          try {
            await db.collection('tasks').updateOne({ user: ObjectId(req.user._id), _id: ObjectId(_id) }, { $set: { title } })
          } catch (e) {
            console.log(e)
            return res.status(500).send(e)
          }
        })
      )
      const tasks = await db.collection('tasks').find({ user: ObjectId(req.user._id) }).toArray()
      return res.status(201).send(tasks)
    }

    //if not array then update multiple items with same value
    try {
      await db.collection('tasks').updateMany({ user: ObjectId(req.user._id) }, update)
      const tasks = await db.collection('tasks').find({ user: ObjectId(req.user._id) }).toArray()
      return res.status(201).send(tasks)
    } catch (e) {
      console.log(e)
      return res.status(500).send(e)
    }
  }

  //update single item
  const query = search.hasOwnProperty('_id') ? { user: ObjectId(req.user._id), _id: ObjectId(search._id) } : { ...search }

  try {
    await db.collection('tasks').updateOne(query, update)
    const tasks = await db.collection('tasks').find({ user: ObjectId(req.user._id) }).toArray()
    res.status(201).send(tasks)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

//delete one or all
router.delete('/api/v1/tasks/:id', requireLogin, cleanCache, async (req, res) => {
  console.log('delete')
  try {
    const taskID = req.params.id
    if(taskID === "deleteall") {
      console.log('delete All')
      try {
        const db = getDb()
        await db.collection('tasks').deleteMany({ user: ObjectId(req.user._id) })
        const tasks = await db.collection('tasks').find({ user: ObjectId(req.user._id) }).toArray()
        return res.status(201).send(tasks)
      } catch (e) {
        console.log(e)
        return res.status(500).send(e)
      }
    }
    const db = getDb()
    await db.collection('tasks').deleteOne({ user: ObjectId(req.user._id), _id: ObjectId(taskID) })
    const tasks = await db.collection('tasks').find({ user: ObjectId(req.user._id) }).toArray()
    res.status(201).send(tasks)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

module.exports = router