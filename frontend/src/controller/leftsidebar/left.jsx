import React, { useEffect } from 'react'

import "./left.css"
import XIcon from '@mui/icons-material/X';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { NavLink } from 'react-router-dom';
import User from "../../../public/avatars/boy1.png"
import LogoutIcon from '@mui/icons-material/Logout';
import { useMutation,useQuery,useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Auth } from '../queryFn/queryFn';



function rightsidebar() {
  const query=useQueryClient()
const size=window.innerWidth;
const {mutate,isPending,error}=useMutation({
  mutationFn:async()=>{
  try{  const res=await fetch("https://tiwiter-done-1.onrender.com/auth/logout",{
   method:"POST",
   credentials:"include",
    })

    const data=await res.json();
    if(!res.ok) throw new Error (data.error);
  }catch(err){
    throw new Error(err.message);
  }
  },
  onSuccess:()=>{
    toast.success("successfuly log out");
  
   query.setQueryData(["auth"],null);
  
  }
})
const {data:unread,isLoading}=useQuery({
  queryKey:["unreadNoti"],
  queryFn:async()=>{
    try{
     const res=await fetch("https://tiwiter-done-1.onrender.com/notification/unread",{
      credentials:"include"
     })
     const data=await res.json();
     if(!res.ok) throw new Error(data.error || "something is wrong");
       return data;
    }catch(err){
    throw new Error(err.message);
    
    }
  },
  retry:false,
})



const {mutate:notificatio,isPending:Pending}=useMutation({
  mutationFn:async ()=>{
    
    try{
    const res=await fetch("https://tiwiter-done-1.onrender.com/notification/update",{
      method:"POST",
      credentials:"include",
    })
 
    const data=await res.json();
    if(!res.ok) throw new Error(data.error || "something is wrong");
    return data;
    }catch(err){
      throw new Error(err.message);
      
    }
  },
  onSuccess:()=>{
  
    query.setQueryData(['unreadNoti'],[])

  },
  onError:()=>{
    toast.error("faild read notification")
  }
})
  window.addEventListener("resize",()=>{
  
   setState(window.innerWidth);
 
})
 const [state,setState]=React.useState(size)
 const {data}=useQuery({queryKey:["auth"],queryFn:Auth,retry:false})



if(isLoading ) return <div>Loading.....</div>
  return (
    <div className='left-sidebar'>
        <div>
    <div className="icon-contain">
      <XIcon className='xicon'/>
    </div>

    <div className="navigation-link">
    <NavLink to={"/"}> <p><HomeFilledIcon className='icon'/>{state>1200 && "Home" } </p></NavLink>  
  <NavLink to={"/notification"}> <div className="noti-unread" onClick={()=>
    notificatio()}>   <p>
  <NotificationsIcon  className='icon'/>{state>1200 && "Notification"} </p>
 {unread.length>0 &&<p className='unread' >{unread.length}</p>}
  </div>
                                     
  </NavLink>  
    <NavLink to={`/profile/${data.id}`}>   <p><PersonIcon className='icon' />{state>1200 && "Profile" } </p>    </NavLink>
    </div>
    <div className="user">
      <div className='userloggin'>
    <NavLink to={`/profile/${data.id}`}> {data.profileimg ?  <img src={data.profileimg} alt="" />: <div className='imagereplace'>{data.fullname.slice(0,1)}</div> } </NavLink>
       <div>
        <p>{state>1200 && ( data.fullname.length>10? data.fullname.slice(0,8)+"..": data.fullname)}</p>
        <p>{state>1200 && ( data.username.length>10? data.username.slice(0,8)+"..": data.username)}</p>
       </div>
       </div>
       <div className='logout-container'>
        <LogoutIcon className='logout'onClick={()=>{
          mutate();
        }}/>
        <p >Log out</p>
       </div>
    </div>
    </div>
    </div>
  )
}

export default rightsidebar
