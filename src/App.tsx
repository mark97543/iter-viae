import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Header from './Components/Header/Header'
import Home from './Pages/Public/Home/Home'
import About from './Pages/Public/About/About'
import Login from './Pages/Public/Login/Login'

function App() {


  return (
    <BrowserRouter>
      <Header/>
      <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App

