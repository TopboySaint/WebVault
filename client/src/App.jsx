import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Landingpage from './pages/Landingpage'
import Services from './pages/Services'
import Investments from './pages/Investments'
import About from './pages/About'
import Contact from './pages/Contact'
import Signup from './pages/Signup'
import Signin from './pages/Signin'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Landingpage/>}></Route>
      <Route path='/services' element={<Services/>}></Route>
      <Route path='/investments' element={<Investments/>}></Route>
      <Route path='/about' element={<About/>}></Route>
      <Route path='/contact' element={<Contact/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/signin' element={<Signin/>}></Route>
    </Routes>
  )
}

export default App