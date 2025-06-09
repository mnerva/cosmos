import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import { CartProvider } from "./components/CartContext";
import './index.css';
import Home from './pages/Home';
import Offers from './pages/Offers';
import Cart from './pages/Cart';
import Reservations from './pages/Reservations';
import Confirmation from './pages/Confirmation';

export default function App() {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat overflow-hidden font-josefin" 
      style={{ backgroundImage: "url('/assets/images/bg.png')" }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/reservations" element={<Reservations />}/>
        <Route path='/confirmation' element={<Confirmation/>}/>
      </Routes>
    </div>
  )
}
