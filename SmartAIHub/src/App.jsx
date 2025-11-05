import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center space-x-4 mb-8">
            <a href="https://vite.dev" target="_blank" className="hover:opacity-75">
              <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank" className="hover:opacity-75">
              <img src={reactLogo} className="h-16 w-16" alt="React logo" />
            </a>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Vite + React</h1>
          <div className="text-center">
            <button
              onClick={() => setCount((count) => count + 1)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
              count is {count}
            </button>
            <p className="text-gray-600 mb-4">
              Edit <code className="bg-gray-200 px-1 rounded">src/App.jsx</code> and save to test HMR
            </p>
          </div>
          <p className="text-center text-gray-500 text-sm">
            Click on the Vite and React logos to learn more
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
