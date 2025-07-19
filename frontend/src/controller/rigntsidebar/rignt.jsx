import React from 'react'
import "./rignt.css"
import { useQueryClient} from "@tanstack/react-query"
import {  useMutation, useQuery, } from '@tanstack/react-query'
import userFollow from '../homemiddle/hooks/userfollow'
import { NavLink } from 'react-router-dom'
function rignt() {
  const query=useQueryClient()
  const {data,isLoading,error}=useQuery({
    queryKey:["suggest"],
    queryFn:async ()=>{
      try{
   const res=await fetch("http://localhost:5000/user/suggest",{
    credentials:"include",
   });


     const resdata= await res.json();
     if(!res.ok) throw new Error(resdata.error);
     return resdata;
      }catch(err){
        console.log(err.message)
     throw err;
      }
    }
  });

const {mutate,isPending}=userFollow()

    function Follow(e){
 const user=e.target.id
 mutate(user)
  }

  if(isLoading) return <div>Loading..</div>
  if(data.length==0) return <div>Null</div>
  return (
    <div>
      <div className="right-container">
        <h2>Who to follow</h2>
      {data.map((val,index)=>  <div key={index} className="user-follow">
       
       <NavLink to={`/profile/${val.id}`}>    <div className="name">
      {val.profileimg?<img src={val.profileimg} alt="" />: <div className='imgaereplace'>{val.fullname.slice(0,1)}</div>}
          <div >
            <p className='first'>{val.fullname}</p>
            <p className='second'>{val.username}</p>
          </div>
          </div> </NavLink>
          <button onClick={Follow} id={val.id}>{isPending?" Loading": "Follow"}</button>
        </div>
        )}
      </div>
    </div>
  )
}

export default rignt

