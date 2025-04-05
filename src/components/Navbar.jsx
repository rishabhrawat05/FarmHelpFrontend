import React from 'react'
import { NavLink } from "react-router"
import "../css/Navbar.css"
import { FaSeedling } from 'react-icons/fa'
const  Navbar=()=> {
  return (
    <div className='Navbar'>
      <div className='logo'>
      <FaSeedling size={40} />
      <h2>FarmHelp</h2>
      </div>
      <div className='button-section'>
      <NavLink to="/" className="link" >Home</NavLink>
      <NavLink to="/upload-crop" className="link" >Upload Crop</NavLink>
      <NavLink to="/predict-price" className="link">Predict Price</NavLink>
      <NavLink to="/chat" className="link">Chat</NavLink>
      </div>
    </div>
  )
}

export default Navbar
