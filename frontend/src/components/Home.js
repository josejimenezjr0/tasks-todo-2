import React, { useEffect, useState } from 'react'
import axios from 'axios'
import TaskContainer from './TasksContainer'
import AddNew from './AddNew'
import { connect } from 'react-redux'
import { actionGenerators } from '../redux'

const Home = ({
  taskList,
  taskChanges,
  loading,
  adding,
  editing,
  toggleEdit,
  editInputs,
  apiRequest,
  apiFailure,
  apiSuccess,
  toggleEditAll,
  allActions,
  allToggle,
  allSubmit
  }) => {

  const [tasks, setTasks] = useState({
    userInput: '',
  })

  const getInitList = async () => {
    apiRequest('loading')
    try {
      const res = await axios.get('http://192.168.86.21:3000/api/v1/tasks')
      apiSuccess('loading', res.data)
    } catch (error) {
      console.log(error)
      apiFailure('loading', error)
    }
  }

  useEffect(() => {
    getInitList()
  },[])

  const handleUserInput = (e) => {
    setTasks({ ...tasks, userInput: e.target.value })
  }

  const addTask = async () => {
    apiRequest('adding')
    try {
      const res = await axios.post('http://192.168.86.21:3000/api/v1/tasks', {
        title: tasks.userInput,
        done: false
      })
      apiSuccess('adding', res.data)
      setTasks({ ...tasks, userInput: '' })
    } catch (error) {
      console.log(error)
      apiFailure('adding', error)
    }
  }

  const title = (id) => {
    const [{ title }] = taskChanges.filter(task => task._id === id)
    return title
  }

  const editDone = ({ id }) => ({ search: { _id: id }, change: { done: !taskList.filter(task => task._id === id)[0].done } })
  const editTitle = ({ id }) => ({ search: { _id: id }, change: { title: title(id) } })
  const editDoneAll = ({ done }) => ({ search: {}, change: { done } })
  const editTitleAll = (editList) => {
    allToggle('edit', false)
    allSubmit()
    return { search: {}, change: editList }
  }

  const submitEdit = async ({ type, payload }) => {
    const { id } = payload
    apiRequest('editing')
    const edit = {
      done: editDone,
      title: editTitle,
      doneAll: editDoneAll,
      titleAll: editTitleAll
    }
    try {
      const res = await axios.put(`http://192.168.86.21:3000/api/v1/tasks`, edit[type](payload))
      console.log('res.data: ', res.data);
      apiSuccess('editing', res.data, id)
    } catch (error) {
      console.log(error)
      apiFailure('editing', error)
    }
  }

  const deleteTask = async (id) => {
    apiRequest('deleting')
    try {
      const res = await axios.delete(`http://192.168.86.21:3000/api/v1/tasks/${ id === 'all' ? 'deleteall' : id }`)
      apiSuccess('deleting', res.data)
      id === 'all' && allToggle('delete', false)
    } catch (error) {
      console.log(error)
      apiFailure('deleting', error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-xs mt-16">
        <AddNew input={ tasks.userInput } addTask={ addTask } handleUserInput={ handleUserInput } />
      </div>
      {
        loading ? 
        <p>loading...</p>
        :
        <TaskContainer 
          tasks={ taskList } 
          toggleEdit={ toggleEdit } 
          editInputs={ editInputs } 
          taskChanges={ taskChanges }
          title={ title }
          submitEdit={ submitEdit }
          deleteTask={ deleteTask }
          allActions={ allActions }
          toggleEditAll={ toggleEditAll }
          allToggle={ allToggle }
        />
      }
    </div>
  )
}

const mapStateToProps = state => ({ 
  taskList: state.taskList,
  taskChanges: state.taskChanges,
  loading: state.loading,
  adding: state.adding,
  editing: state.editing,
  loadingError: state.loadingError,
  addingError: state.addingError,
  editingError: state.editingError,
  allActions: state.allActions
})

export default connect(mapStateToProps, actionGenerators)(Home)