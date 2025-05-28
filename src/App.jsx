import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import './index.css'
import Home from './pages/Home'
import Offers from './pages/Offers'

export default function App() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden font-josefin" 
      style={{ backgroundImage: "url('/assets/images/bg.png')" }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/offers" element={<Offers />} />
      </Routes>
    </div>
  )
}
