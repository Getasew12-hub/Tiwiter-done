import React from 'react'
import "./post.css"

import { useOutletContext } from 'react-router-dom';
import UsersPost from '../homemiddle/usersPost';

function userpost(pro) {
  const {user}=useOutletContext()
  
  return (
   <div className="user-post-containe">
        {user.map((val,index)=>
           <UsersPost all={val} key={index}/>)}
       
        </div>
  )
}

export default userpost
