const express = require('express')
const router = new express.Router()
const { ObjectId } = require('mongodb')
const { getDb } = require('../db/dbConnect')
const cleanCache = require('../middlewares/cleanCache')
const makeSampleUser = require('../middlewares/makeSampleUser')
const { v4: uuidv4 } = require('uuid')

// get all tasks
router.get('/api/v1/sample/tasks', makeSampleUser, async (req, res) => {
  if(req.user) {
    console.log('No sample becauce req.user', req.user);
    return
  }
  console.log('sample get all')

  const collection = 'tasks'
  const query = { user: ObjectId(req.session.user._id) }
  const key = { collection, query }

  setTimeout(async () => {
    console.log('mongo')
    try {
      const db = getDb()
      const tasks = await db.collection(collection).find(query).toArray()
      res.status(201).send(tasks)
    } catch (e) {
      console.log(e)
      res.status(500).send(e)
    }
  }, 500)
})

//get one task
router.get('/api/v1/sample/tasks/:id', async (req, res) => {
  console.log('get one')
  try {
    const taskID = req.params.id
    const db = getDb()
    const task = await db.collection('tasks').findOne({ user: ObjectId(req.session.user._id),  _id: ObjectId(taskID) })
    res.status(201).send(task)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

//add one task
router.post('/api/v1/sample/tasks', makeSampleUser, async (req, res) => {
  console.log('sample get add one')
  try {
    const db = getDb()
    await db.collection('tasks').insertOne({ ...req.body, sample: true, startTime: Date.now(), user: ObjectId(req.session.user._id) })
    const tasks = await db.collection('tasks').find({ user: ObjectId(req.session.user._id) }).toArray()
    res.status(201).send(tasks)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

//update one or many tasks
router.put('/api/v1/sample/tasks', async (req, res) => {
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
            await db.collection('tasks').updateOne({ user: ObjectId(req.session.user._id), _id: ObjectId(_id) }, { $set: { title } })
          } catch (e) {
            console.log(e)
            return res.status(500).send(e)
          }
        })
      )
      const tasks = await db.collection('tasks').find({ user: ObjectId(req.session.user._id) }).toArray()
      return res.status(201).send(tasks)
    }

    //if not array then update multiple items with same value
    try {
      await db.collection('tasks').updateMany({ user: ObjectId(req.session.user._id) }, update)
      const tasks = await db.collection('tasks').find({ user: ObjectId(req.session.user._id) }).toArray()
      return res.status(201).send(tasks)
    } catch (e) {
      console.log(e)
      return res.status(500).send(e)
    }
  }

  //update single item
  const query = search.hasOwnProperty('_id') ? { user: ObjectId(req.session.user._id), _id: ObjectId(search._id) } : { ...search }

  try {
    await db.collection('tasks').updateOne(query, update)
    const tasks = await db.collection('tasks').find({ user: ObjectId(req.session.user._id) }).toArray()
    res.status(201).send(tasks)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

//delete one or all
router.delete('/api/v1/sample/tasks/:id', async (req, res) => {
  console.log('delete')
  try {
    const taskID = req.params.id
    if(taskID === "deleteall") {
      console.log('delete All')
      try {
        const db = getDb()
        await db.collection('tasks').deleteMany({ user: ObjectId(req.session.user._id) })
        const tasks = await db.collection('tasks').find({ user: ObjectId(req.session.user._id) }).toArray()
        return res.status(201).send(tasks)
      } catch (e) {
        console.log(e)
        return res.status(500).send(e)
      }
    }
    const db = getDb()
    await db.collection('tasks').deleteOne({ user: ObjectId(req.session.user._id), _id: ObjectId(taskID) })
    const tasks = await db.collection('tasks').find({ user: ObjectId(req.session.user._id) }).toArray()
    res.status(201).send(tasks)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

module.exports = router