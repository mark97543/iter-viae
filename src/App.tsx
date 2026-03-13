import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Header from './Components/Header/Header'
import Home from './Pages/Public/Home/Home'
import About from './Pages/Public/About/About'

function App() {


  return (
    <BrowserRouter>
      <Header/>
      <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App

