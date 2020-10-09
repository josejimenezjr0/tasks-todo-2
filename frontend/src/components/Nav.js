import React from 'react'
import { Link } from 'react-router-dom'

const Nav = () => {
  return(
    <div className="bg-blue-300 flex rounded-b p-1 font-semibold">
      <div className="w-1/3"></div>
      <div className="w-1/3 flex justify-center">
        <Link to="/" className="text-gray-700 text-sm font-semibold uppercase tracking-wide hover:text-gray-400 focus:outline-none">Tasks Todo</Link>
      </div>
      <div className="w-1/3 flex justify-end pr-4">
        <Link to="/" className="text-gray-700 text-sm font-semibold uppercase tracking-wide hover:text-gray-400 focus:outline-none">Login</Link>
      </div>
    </div>
  )
}

export default Nav