import { useState } from 'react'
import { createBrowserRouter,RouterProvider, Navigate } from 'react-router-dom'
import Login from "./pages/auth/login/login"
import Signup from "./pages/auth/signup/signup"
import Home from './pages/home/home'
import Middel from './controller/homemiddle/middel'
import Notification from './pages/notification/notification'
import ProfilePage from './pages/profile/profilePage'
import Userpost from './controller/post/userpost'
import toast, {Toaster} from "react-hot-toast"
import { useQuery } from '@tanstack/react-query'


function App() {
 const {data,isLoading,error,isSuccess}=useQuery({
  queryKey:["auth"],
  queryFn:async()=>{
    try{
     const res=await fetch("https://tiwiter-done-1.onrender.com/auth/authUser",{
      credentials:"include",

     })


     const data=await res.json();
       if (data.error) return null;
     if(!res.ok) throw new Error(data.error);
  
  
     return data;
    }catch(err){
  throw new Error(err.message);
    }
  },
  retry:false,
  onError:(err)=>{
    toast.error(err.message)
  },

 })
 if(isLoading){
 return <div>Loading...</div>
 }

 const router=createBrowserRouter([
  {
    path:"/",
    element:(data? <Home/>:<Navigate to={"/login"}/> ),
    errorElement:<div>404 page is not found</div>,
    children:[
      {
        path:"/",
        element:<Middel val={"for you"}/>,
        children:[
          {
       index:true,
       element:<Middel />
          },
          {
          path:"/following",
          element:<Middel/>,
        }]
      },
      {
        path:"/notification",
        element:<Notification/>
      },{
        path:"/profile/:user",
        element:<ProfilePage/>,
        children:[
          {
            index:true,
            element:<Userpost/>
          },
          {
            path:"likes",
            element:<Userpost/>
          }
        ]
      }
    ]
  },
  {
    path:"/login",
    element:!data?<Login/>: <Navigate to={"/"}/> ,
  },
  {
    path:"/signup",
    element:!data?<Signup/>: <Navigate to={"/"}/>,
  },

 
])

  return (
    <div className='browser-container'>
      <RouterProvider router={router}/>
      <Toaster/>
    </div>
  )
}

export default App
