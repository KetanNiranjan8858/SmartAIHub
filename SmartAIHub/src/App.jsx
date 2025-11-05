import { useState } from 'react'
import viteLogo from '/vite.svg'
import Header from './Header'
import background from './assets/background.png';


function App() {
  return (
    <div className="App" style={{
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      margin: 0,
      padding: 0
    }}>
      <Header />
    </div>
  )
}

export default App
