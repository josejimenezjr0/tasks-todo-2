import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TaskContainer from './TasksContainer'
import AddNew from './AddNew'
import { connect } from 'react-redux'
import { loadTodosRequest, loadTodosFailure, loadTodosSuccess } from "../redux/actionCreators"

const Home = ({ taskList, editList, taskLoading, loadTodosRequest, loadTodosFailure, loadTodosSuccess }) => {
  const [tasks, setTasks] = useState({
    userInput: '',
    // taskList: [],
    // editList: {},
    taskChanges: [],
    allActions: { title: false, edit: false, delete: false }
  })

  // const initEditList = (tasks) => {
  //   let list = {}
  //   tasks.map(task => {
  //     list[task._id] = false
  //   })
  //   return list
  // }

  // const getInitList = async () => {
  //   try {
  //     const res = await axios.get('http://192.168.86.21:3000/api/v1/tasks')
  //     setTasks({ ...tasks, taskList: res.data, editList: initEditList(res.data) })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const getInitList = async () => {
    loadTodosRequest()
    try {
      const res = await axios.get('http://192.168.86.21:3000/api/v1/tasks')
      // setTasks({ ...tasks, taskList: res.data, editList: initEditList(res.data) })
      loadTodosSuccess(res.data)
    } catch (error) {
      console.log(error)
      loadTodosFailure(error)
    }
  }

  useEffect(() => {
    getInitList()
  },[])

  const handleUserInput = (e) => {
    setTasks({ ...tasks, userInput: e.target.value })
  }

  const addTask = async () => {
    try {
      const res = await axios.post('http://192.168.86.21:3000/api/v1/tasks', {
        title: tasks.userInput,
        done: false
      })
      setTasks({ ...tasks, taskList: res.data, userInput: '' })
    } catch (error) {
      console.log(error)
    }
  }

  const editTask = (taskID) => {
    const [task] = tasks.taskList.filter(task => task._id === taskID)
    const change = [taskID, task.title]
    setTasks({ 
      ...tasks,
      editList: { ...tasks.editList, [taskID]: true },
      taskChanges: [...tasks.taskChanges, change] 
    })
  }

  const handleTaskEdit = (e, taskID) => {
    const task = tasks.taskChanges.filter( ([id, _])=> id === taskID)
    if(task.length === 0) {
      setTasks({ ...tasks, taskChanges: [...tasks.taskChanges, [taskID, e.target.value]] })
    } else {
      const keep = tasks.taskChanges.filter(([id, _]) => id !== taskID)
      setTasks({ ...tasks, taskChanges: [...keep, [taskID, e.target.value]] })
    }
  }

  const getEditTitle = (taskID) => {
    const [task] = tasks.taskChanges.filter( ([id, _])=> id === taskID)
    return task[1]
  }

  const submitEdit = async (taskID) => {
    const [task] = tasks.taskChanges.filter(([id, _]) => id === taskID)
    const keep = tasks.taskChanges.filter(([id, _]) => id !== taskID)
    try {
      const res = await axios.put(`http://192.168.86.21:3000/api/v1/tasks`, { search: { _id: taskID }, change: { title: task[1] } })
      setTasks({ ...tasks, editList: { ...tasks.editList, [taskID]: false }, taskList: res.data, taskChanges: keep })
    } catch (error) {
      console.log(error)
    }
  }

  const handleDone = async (taskID) => {
    const [task] = tasks.taskList.filter(task => task._id === taskID)
    try {
      const res = await axios.put(`http://192.168.86.21:3000/api/v1/tasks`, { search: { _id: taskID }, change: { done: !task.done } })
      setTasks({ ...tasks, taskList: res.data })
    } catch (error) {
      console.log(error)
    }
  }

  const deleteTask = async (taskID) => {
    try {
      const res = await axios.delete(`http://192.168.86.21:3000/api/v1/tasks/${taskID}`)
      setTasks({ ...tasks, taskList: res.data })
    } catch (error) {
      console.log(error)
    }
  }

  const handleDoneAll = async (done) => {
    try {
      const res = await axios.put(`http://192.168.86.21:3000/api/v1/tasks`, { search: {}, change: { done } })
      setTasks({ ...tasks, taskList: res.data })
    } catch (error) {
      console.log(error)
    }
  }

  const editTaskAll = async () => {
    let editAll = {}
    tasks.taskList.map(task => editAll[task._id] = true)
    const currentChanges = tasks.taskChanges.map(([id, title]) => id)
    const addingChanges = tasks.taskList.filter(task => !currentChanges.includes(task._id))
    const addTasks = addingChanges.map(change => [change._id, change.title])
    setTasks({ 
      ...tasks,
      allActions: { ...tasks.allActions, edit: true },
      editList: editAll,
      taskChanges: [...tasks.taskChanges, ...addTasks] 
    })
  }

  const submitEditAll = async () => {
    try {
      const res = await axios.put(`http://192.168.86.21:3000/api/v1/tasks`, { search: {}, change: tasks.taskChanges })
      setTasks({ ...tasks, editList: {}, taskList: res.data, taskChanges: [], allActions: { ...tasks.allActions, edit: false } })
    } catch (error) {
      console.log(error)
    }
  }

  const confirmDelete = () => setTasks({ ...tasks, allActions: { ...tasks.allActions, delete: !tasks.allActions.delete } })

  const deleteTaskAll = async () => {
    console.log('delete all');
    try {
      const res = await axios.delete(`http://192.168.86.21:3000/api/v1/tasks/deleteall`)
      setTasks({ ...tasks, taskList: res.data })
    } catch (error) {
      console.log(error)
    }
  }

  // return (
  //   <div className="flex flex-col items-center justify-center">
  //     <div className="w-full max-w-xs mt-16">
  //       <AddNew input={ tasks.userInput } addTask={ addTask } handleUserInput={ handleUserInput } />
  //     </div>
  //     <TaskContainer 
  //       tasks={ tasks.taskList } 
  //       editTask={ editTask } 
  //       handleTaskEdit={ handleTaskEdit } 
  //       editList={ tasks.editList } 
  //       taskChanges={ tasks.taskChanges }
  //       getEditTitle={ getEditTitle }
  //       submitEdit={ submitEdit }
  //       handleDone={ handleDone }
  //       deleteTask={ deleteTask }
  //       allActions={ tasks.allActions }
  //       handleDoneAll={ handleDoneAll }
  //       editTaskAll={ editTaskAll }
  //       submitEditAll={ submitEditAll }
  //       deleteTaskAll={ deleteTaskAll }
  //       confirmDelete={ confirmDelete }
  //     />
  //   </div>
  // )

    return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-xs mt-16">
        <AddNew input={ tasks.userInput } addTask={ addTask } handleUserInput={ handleUserInput } />
      </div>
      {
        taskLoading ? 
        <p>loading...</p>
        :
        <TaskContainer 
          tasks={ taskList } 
          editTask={ editTask } 
          handleTaskEdit={ handleTaskEdit } 
          editList={ editList } 
          taskChanges={ tasks.taskChanges }
          getEditTitle={ getEditTitle }
          submitEdit={ submitEdit }
          handleDone={ handleDone }
          deleteTask={ deleteTask }
          allActions={ tasks.allActions }
          handleDoneAll={ handleDoneAll }
          editTaskAll={ editTaskAll }
          submitEditAll={ submitEditAll }
          deleteTaskAll={ deleteTaskAll }
          confirmDelete={ confirmDelete }
        />
      }
    </div>
  )
}

const mapStateToProps = state => ({ taskList: state.taskList, editList: state.editList, taskLoading: state.taskLoading })

export default connect(mapStateToProps, { loadTodosRequest, loadTodosFailure, loadTodosSuccess })(Home)