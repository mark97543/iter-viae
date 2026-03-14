import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './Components/Header/Header'
import Home from './Pages/Public/Home/Home'
import About from './Pages/Public/About/About'
import Login from './Pages/Public/Login/Login'
import Register from './Pages/Public/Register/Register'
import { AuthProvider } from './Contexts/AuthContext'
import { StateProvider } from './Contexts/StateContext'
import { ProtectedRoute } from './Components/ProtectedRoute/ProtectedRoute'
import Dashboard from './Pages/Private/Dashboard/Dashboard'
import NotFound from './Pages/Public/NotFound/NotFound'

function App() {


  return (
    <AuthProvider>
      <StateProvider>
        <BrowserRouter>
          <Header/>
          <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </main>
        </BrowserRouter>
      </StateProvider>
    </AuthProvider>
  )
}

export default App

