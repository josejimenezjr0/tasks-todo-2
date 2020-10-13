import { actions } from './actionCreators'

const initialState = {
  userInput: '',
  taskList: [],
  editList: {},
  taskLoading: false,
  taskChanges: [],
  allActions: { title: false, edit: false, delete: false }
}

const initEditList = (tasks) => {
  let list = {}
  tasks.map(task => {
    list[task._id] = false
  })
  return list
}

const handlers = {
  [actions.LOAD_POSTS_REQUEST]: (state, action) => ({ ...state, taskLoading: true }),
  [actions.LOAD_POSTS_SUCCESS]: (state, action) => ({ ...state, taskLoading: false, taskList: action.payload, editList: initEditList(action.payload) }),
  [actions.LOAD_POSTS_FAILURE]: (state, action) => ({ ...state, taskLoading: false, taskList: action.payload })
}

const createReducer = (initialState, handlers) => (state = initialState, action) => handlers.hasOwnProperty(action.type) ? handlers[action.type](state, action) : state

export default createReducer(initialState, handlers)