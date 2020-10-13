const actions = {
  ADD_TODO: 'ADD_TODO',
  EDIT_TODO: 'EDIT_TODO',
  TOGGLE_DONE: 'TOGGLE_DONE',
  DELETE_TODO: 'DELETE_TODO',
  TOGGLE_DONE_ALL: 'TOGGLE_DONE_ALL',
  TOGGLE_EDIT_ALL: 'TOGGLE_DONE_ALL',
  LOAD_POSTS_REQUEST: 'LOAD_POSTS_REQUEST',
  LOAD_POSTS_SUCCESS: 'LOAD_POSTS_SUCCESS',
  LOAD_POSTS_FAILURE: 'LOAD_POSTS_FAILURE',
}

const addTodo = text => ({ type: actions.ADD_TODO, payload: text })
const editTodo = (text, id) => ({ type: actions.EDIT_TODO, payload: { text, id } })
const toggleDone = id => ({ type: actions.TOGGLE_DONE, payload: id })
const deleteDone = id => ({ type: actions.DELETE_TODO, payload: id })
const toggleDoneAll = done => ({ type: actions.TOGGLE_DONE_ALL, payload: done })
const toggleEditAll = () => ({ type: actions.TOGGLE_EDIT_ALL, payload: '' })
const loadTodosRequest = () => ({ type: actions.LOAD_POSTS_REQUEST })
const loadTodosFailure = err => ({ type: actions.LOAD_POSTS_FAILURE, payload: err })
const loadTodosSuccess = res => ({ type: actions.LOAD_POSTS_SUCCESS, payload: res })

export {
  actions,
  addTodo,
  editTodo,
  toggleDone,
  deleteDone,
  toggleDoneAll,
  toggleEditAll,
  loadTodosRequest,
  loadTodosFailure,
  loadTodosSuccess,
}