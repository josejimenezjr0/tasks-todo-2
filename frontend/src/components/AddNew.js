import React from 'react'

const AddNew = ({ input, addTask, handleUserInput }) => {
  return (
    <div className="shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div>
        <div className="mb-4">
          <p className="block text-white font-bold mb-2">Task</p>
          <input value={ input } onChange={ handleUserInput } className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="name" type="text" placeholder="enter task"/>
        </div>
      </div>
      <div className="flex justify-around mb-6">
        <div className="mb-4">
          <button onClick={ addTask } className={`bg-green-300 cursor-default' text-gray-900 tracking-wide font-bold py-2 px-4 rounded focus:outline-none`} name="new" >Add</button>
        </div>
      </div>
    </div>
  )
}

export default AddNew