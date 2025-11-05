import React from 'react'
import './Header.css'
import logo from './assets/logo.png'

function Header() {
  return (
    <div className="header">
      <img src={logo} alt="website logo" />
      <div className="feature">
        <div className="chatAnalysis">
        <h2>Chat Analysis</h2>
      </div>
      <div className="spamDetection">
        <h2>Spam Detection</h2>
      </div>
      </div>
    </div>
  )
}

export default Header