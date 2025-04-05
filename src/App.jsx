import { useState } from 'react'

import './App.css'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router'
import UploadCrop from './pages/UploadCrop'
import PredictPrice from './pages/PredictPrice'
import Chat from './pages/Chat'

function App() {

  return (
    <BrowserRouter>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/upload-crop" element={<UploadCrop/>} /> 
        <Route path='/predict-price' element={<PredictPrice/>} />
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
