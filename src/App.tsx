import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Header from './Components/Header/Header'
import Home from './Pages/Public/Home/Home'
import About from './Pages/Public/About/About'
import Login from './Pages/Public/Login/Login'
import Register from './Pages/Public/Register/Register'
import { AuthProvider } from './Contexts/AuthContext'
import { ProtectedRoute } from './Components/ProtectedRoute/ProtectedRoute'
import Dashboard from './Pages/Private/Dashboard/Dashboard'

function App() {


  return (
    <AuthProvider>
      <BrowserRouter>
        <Header/>
        <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

