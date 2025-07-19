import React from 'react'
import "./middel.css"
import { NavLink } from 'react-router-dom'
import Createpost from './createpost'
import Loading from '../skeleton/loading'
import UsersPost from './usersPost'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

function middel() {
  const [state,setState]=React.useState("for you")
  const post=()=>{
    switch (state){
      case "for you":
      return "https://tiwiter-done-1.onrender.com/post/all";
      case "follow":
        return "https://tiwiter-done-1.onrender.com/post/following";
     
        default :
       return "https://tiwiter-done-1.onrender.com/post/all";
    }
  }
 
  const url=post()

const {data,isLoading,refetch,isRefetching}= useQuery({
  queryKey:['fetchPost'],
  queryFn:async()=>{
    try{
    const respo=await fetch(url,{
      credentials:"include"
    });
    const responsejson=await respo.json();
    if(!respo.ok) throw new Error (data.error);
    return responsejson;
    }catch(err){
      console.log(err.message);
      throw err;
    }
  },
  retry:false,
  
})

 const { data: userfollowget, isLoading: comming } = useQuery({
    queryKey: ["followInclud"],
    queryFn: async () => {
      try {
        const res = await fetch("https://tiwiter-done-1.onrender.com/post/followId", {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "something is wrong");
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    retry: false,
  });
useEffect(()=>{
   refetch()
},[state])
 
if(isLoading || isRefetching || comming) return <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><Loading /></div>
{console.log("data length",data)}
  return (
       <div  id='home-controler-middle'>
       
      <div className="post-controller ">
        <div className="navigation-link">
            <NavLink onClick={()=>{
              setState("for you")
            }} end to={"/"}>For you</NavLink> <br />
            <NavLink onClick={()=>{
              setState("follow")
            }} end to={"/following"}>Following</NavLink>
        </div>
     <div className="create-post">
      <Createpost />
      
     </div>
    
     
     {/* <div className="posts">
      {data.map((val,index)=>
            <UsersPost key={index} all={val} state={state}/>
            )}
     </div> */}
     </div>
 
    </div>
  )
}

export default middel
