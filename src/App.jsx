import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminPanel from './pages/AdminPanel'
import Invite from './pages/Invite'
import Gallery from './pages/Gallery'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/invitacion" replace />} />
        <Route path="/invitacion" element={<Invite />} />
        <Route path="/novios" element={<AdminPanel />} />
        <Route path="/galeria" element={<Gallery />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App