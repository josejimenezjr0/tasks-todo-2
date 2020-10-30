import React from 'react'
import SampleUser from './SampleUser'

const Home = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-xs mt-16 text-center">
        <p className="block text-white font-bold mb-2 text-3xl">Welcome!</p>
        <p className="block text-white font-bold mb-2">Sign in to see your tasks or play with the sample user below.</p>
        <SampleUser />
      </div>
    </div>
  )
}

export default Home