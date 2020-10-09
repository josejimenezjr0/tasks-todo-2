const express = require('express')
const router = new express.Router()
const { ObjectId } = require('mongodb')
const { getDb } = require('../db/dbConnect')

// get all tasks
router.get('/api/v1/tasks', async (req, res) => {
  console.log('get all')
  try {
    const db = getDb()
    const tasks = await db.collection('tasks').find({}).toArray()
    res.status(201).send(tasks)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

//get one task
router.get('/api/v1/tasks/:id', async (req, res) => {
  console.log('get one')
  try {
    const taskID = req.params.id
    const db = getDb()
    const task = await db.collection('tasks').find({ _id: ObjectId(taskID) }).toArray()
    res.status(201).send(task)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

router.post('/api/v1/tasks', async (req, res) => {
  console.log('get add one')
  try {
    const db = getDb()
    await db.collection('tasks').insertOne(req.body)
    const tasks = await db.collection('tasks').find({}).toArray()
    res.status(201).send(tasks)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

router.put('/api/v1/tasks', async (req, res) => {
  const db = getDb()
  const { search, change } = req.body
  const update = {$set: change }

  if(Object.keys(search).length === 0) {
    console.log('update several')
    if(Array.isArray(change)) {
      change.map(async ([id, title]) => {
        try {
          await db.collection('tasks').updateOne({ _id: ObjectId(id) }, { $set: { title } })
        } catch (e) {
          console.log(e)
          return res.status(500).send(e)
        }
      })
      const tasks = await db.collection('tasks').find({}).toArray()
      return res.status(201).send(tasks)
    }

    try {
      await db.collection('tasks').updateMany({}, update)
      const tasks = await db.collection('tasks').find({}).toArray()
      return res.status(201).send(tasks)
    } catch (e) {
      console.log(e)
      return res.status(500).send(e)
    }
  }

  const query = search.hasOwnProperty('_id') ? { _id: ObjectId(search._id) } : { ...search }

  try {
    await db.collection('tasks').updateOne(query, update)
    const tasks = await db.collection('tasks').find({}).toArray()
    res.status(201).send(tasks)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

router.delete('/api/v1/tasks/:id', async (req, res) => {
  console.log('delete')
  try {
    const taskID = req.params.id
    if(taskID === "deleteall") {
      console.log('delete All')
      try {
        const db = getDb()
        await db.collection('tasks').deleteMany({ })
        const tasks = await db.collection('tasks').find({}).toArray()
        return res.status(201).send(tasks)
      } catch (e) {
        console.log(e)
        return res.status(500).send(e)
      }
    }
    const db = getDb()
    await db.collection('tasks').deleteOne({ _id: ObjectId(taskID) })
    const tasks = await db.collection('tasks').find({}).toArray()
    res.status(201).send(tasks)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
})

router.delete('/api/v1/tasks/deleteall', async (req, res) => {

})

module.exports = router