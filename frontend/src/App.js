import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './components/Home'

const App = () => {
  return (
    <Router>
      <div className="bg-gray-600 h-screen">
        <Nav />
        <Switch>
          <Home />
        </Switch>
      </div>
    </Router>
  )
}

export default App;
