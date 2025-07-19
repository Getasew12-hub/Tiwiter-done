import React, { use, useRef } from 'react'
import "./notification.css"
import SettingsIcon from '@mui/icons-material/Settings';
import { Notification } from '../../controller/data/nifi.data';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import avater from '/avatar-placeholder.png';
import toast from 'react-hot-toast';
function notification() {
  const query=useQueryClient()
   const deletenoti=useRef()
   const Back=useRef()
  const {data,isLoading}=useQuery({
    queryKey:["notification"],
    queryFn:async ()=>{
      try{
        
         const res=await fetch("https://tiwiter-done-1.onrender.com/notification",{
          credentials:"include",
         })

         const data=await res.json();
         if(!res.ok) throw new Error(data.error);
         return data;
      }catch(err){
          throw new Error(err.message);
          
      }
    },
    retry:false,
  })

  const {mutate,isPending,}=useMutation({
    mutationFn:async()=>{
      try{

      const res=await fetch("https://tiwiter-done-1.onrender.com/notification/delete",{
        method:"DELETE",
        credentials:"include"
      })
      const data=await res.json();
      if(!res.ok) throw new Error(data.error || "something is wrong");
        return data;
      }catch(err){
   throw new Error(err.message);
   
      }
    },
    onSuccess:()=>{
      toast.success("successfuly delete");
        query.setQueryData(["notification"],[])
    },
    onError:()=>{
      toast.error("faild to delete")

    }
  })
  if(isLoading) return <div>Loading..</div>
 
    function Clear(e){
      
        e.stopPropagation()
   deletenoti.current.removeAttribute("hidden")
    }
       window.addEventListener("click",()=>{
    
    if(!deletenoti.current.getAttribute("hidden")){
       deletenoti.current.setAttribute("hidden","true") 
    }
})
function Remove(){
    mutate();
}
  return (
    <div className='notification-container' ref={Back}>
        <div className="notication-delete">
            <p>Notification</p>
            <div>
            <SettingsIcon className='setting' onClick={Clear}/>
            <p hidden ref={deletenoti} onClick={Remove}>Delete all notification</p>
            </div>
        </div>
        {data.length<1 ? <div style={{textAlign:"center",fontWeight:"bold",margin:"10px 0"}}>not have notification</div>: 
        <div>
        {data.map((val,index)=>
        <div key={index}>
     {val.type=="Follow" ?  <div className="notification-follow">
        <div className="profile">
       <PersonIcon className='icon'/>
      {val.profiimg? <img src={val.profiimg} alt="" />:<img src={avater} />}
       </div>
       <p>{val.username}  <span>followed you</span></p>
        </div>:
        <div className="notification-like">
            <div className="profile">
           <FavoriteIcon className='icon'/>
            {val.profiimg? <img src={val.profiimg} alt="" />:<img src={avater} />}
            </div>
           <p>{val.username} <span>liked your post</span></p>
          
            </div>}
            </div>
       )}
       </div>}
    </div>
  )
}

export default notification
