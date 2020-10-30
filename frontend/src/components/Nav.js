import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

const Nav = ({ user }) => {
  return(
    <div className="bg-blue-300 flex rounded-b p-1 font-semibold">
      <div className="w-1/3"></div>
      <div className="w-1/3 flex justify-center">
        <Link to="/" name="nav-title" className="text-gray-700 text-sm font-semibold uppercase tracking-wide hover:text-gray-400 focus:outline-none">Tasks Todo</Link>
      </div>
      <div className="w-1/3 flex justify-end pr-4">
      {
        user ?
          <a href="http://localhost:3000/api/logout" name="logout" className="text-gray-700 text-sm font-semibold uppercase tracking-wide hover:text-gray-400 focus:outline-none">Logout</a>
        :
          <a href="http://localhost:3000/api/login" name="login" className="text-gray-700 text-sm font-semibold uppercase tracking-wide hover:text-gray-400 focus:outline-none">Login</a>
      }
      </div>
    </div>
  )
}

const mapStateToProps = state => ({ user: state.user })

export default connect(mapStateToProps)(Nav)