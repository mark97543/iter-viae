import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Header from './Components/Header/Header'
import Home from './Pages/Public/Home/Home'

function App() {


  return (
    <BrowserRouter>
      <Header/>
      <main>
      <Routes>
        <Route path="/" element={<Home />} />

      </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App

