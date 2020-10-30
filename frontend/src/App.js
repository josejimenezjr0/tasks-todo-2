import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import axios from 'axios'
import Nav from './components/Nav'
import Home from './components/Home'
import Tasks from './components/Tasks'
import { connect } from 'react-redux'
import { actionGenerators } from './redux'

const App = ({ getUser, user }) => {
  const checkUser = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/current_user')
      console.log('res.data: ', res.data);
      getUser(res.data)
    } 
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkUser()
  },[])

  return (
    <Router>
      <div className="bg-gray-600 h-screen">
        <Nav />
        <Switch>
          <Route exact path="/">
            { user ? <Redirect to="/tasks" /> : <Home /> }
          </Route>
          <Route path="/tasks" component={ Tasks } />
        </Switch>
      </div>
    </Router>
  )
}

const mapStateToProps = state => ({ user: state.user })

export default connect(mapStateToProps, actionGenerators)(App)
