
import './App.css'
import * as React from 'react'
import RootRouter from "@/router.jsx"
import { BrowserRouter } from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
      <RootRouter />
    </BrowserRouter>
  )
}
export default App