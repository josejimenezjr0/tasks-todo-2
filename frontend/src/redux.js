import { createStore } from 'redux'

const actionList = [
  'API_REQUEST',
  'API_FAILURE',
  'API_SUCCESS',
  'TOGGLE_EDIT',
  'EDIT_INPUTS',
  'TOGGLE_DONE_ALL',
  'TOGGLE_EDIT_ALL',
  'ALL_TOGGLE',
  'ALL_SUBMIT'
]

const initialState = { taskList: [], taskChanges: [], allActions: { edit: false, delete: false } }
const actions = actionList.reduce((list, action) => ({ ...list, [action]: action }), {})

export const actionGenerators = {
  apiRequest: (type) => ({ type: actions.API_REQUEST, payload: type }),
  apiFailure: (type, error) => ({ type: actions.API_FAILURE, payload: { type, error } }),
  apiSuccess: (type, res, id) => ({ type: actions.API_SUCCESS, payload: { type, res, id } }),
  toggleEdit: id => ({ type: actions.TOGGLE_EDIT, payload: id }),
  editInputs: (e, id) => ({ type: actions.EDIT_INPUTS, payload: { e, id } }),
  toggleEditAll: () => ({ type: actions.TOGGLE_EDIT_ALL }),
  allToggle: (type, change) => ({ type: actions.ALL_TOGGLE, payload: { type, change } }),
  allSubmit: () => ({ type: actions.ALL_SUBMIT })
}

const getTask = (state, id) => {
  const [task = null] = state.taskList.filter(task => task._id === id)
  return task
}

const keepTasks = (state, id) => state.taskChanges.filter(task => task._id !== id)

const inputs = (state, e, id) => getTask(state, id) ? [...keepTasks(state, id), { ...getTask(state, id), title: e.target.value }] : [...state.taskChanges, { ...getTask(state, id), title: e.target.value }]

const handlers = {
  [actions.API_REQUEST]: (state, { payload }) => ({ ...state, [payload]: true }),
  [actions.API_FAILURE]: (state, { payload: { type, error } }) => ({ ...state, [type]: false, [`${type}Error`]: error }),
  [actions.API_SUCCESS]: (state, { payload: { type, res, id } }) => ({ ...state, [type]: false, taskList: res, ...(id && { taskChanges: keepTasks(state, id) }) }),
  [actions.TOGGLE_EDIT]: (state, { payload }) => ({ ...state, taskChanges: [...state.taskChanges, getTask(state, payload)] }),
  [actions.EDIT_INPUTS]: (state, { payload: { e, id } }) => ({ ...state, taskChanges: inputs(state, e, id)}),
  [actions.TOGGLE_EDIT_ALL]: state => ({ ...state, allActions: { ...state.allActions, edit: true }, taskChanges: [...new Map([...state.taskList, ...state.taskChanges].map(task => [task._id, task])).values()]}),
  [actions.ALL_TOGGLE]: (state, { payload: { type, change } }) => ({ ...state, allActions: { ...state.allActions, [type]: change } }),
  [actions.ALL_SUBMIT]: state => ({ ...state, taskChanges: [] })
}

const reducer = (state = initialState, action) => handlers.hasOwnProperty(action.type) ? handlers[action.type](state, action) : state

export default createStore(reducer)