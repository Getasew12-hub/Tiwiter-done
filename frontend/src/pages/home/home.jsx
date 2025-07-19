import React from 'react'
import "./home.css"
import Left from "../../controller/leftsidebar/left"
import { Outlet } from 'react-router-dom'
import Rignt from "../../controller/rigntsidebar/rignt"


function home() {

 

  return (
    <div className='home-container'>
  <div className="leftsidebar">
  <Left/>
  </div>
  <div className="middel-container">
   <Outlet className="middle"/>
  </div>
    <div className="rigntsidebar">
    <Rignt/> 
    </div>
    </div>
  )
}

export default home
