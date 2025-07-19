import React, { useEffect, useRef, useState } from 'react'
import {Link} from "react-router-dom"
import XIcon from '@mui/icons-material/X';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonIcon from '@mui/icons-material/Person';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import PasswordIcon from '@mui/icons-material/Password';
import "./signup.css"
import { useMutation,useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';

// const query=useQueryClient()
export default function signup() {
  const [errorcheck,setError]=useState(false)
  const [usernameValid,setValid]=useState(false)
  const [passwordValid,setpassword]=useState(false)
  const query=useQueryClient();
 
       const [state,setState]=React.useState({
            email:"",
            username:"",
            fullname:"",
            password:""
       })
   
function SignUP(event){

   const {name,value}=event.target;
   
    setState((prev)=>{
      return  {
            ...prev,
            [name]:value.trimStart(),
      }
   
    }) 
}
const {mutate,isPending,isError,isSuccess,error}=useMutation({
  mutationFn: async ({username,fullname,password,email})=>{
    try{
          const res=await fetch("http://localhost:5000/auth/signup",{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
            },
            body:JSON.stringify({username,password,fullname,email}),
            credentials:"include"
          })
         
          const data=await res.json();
           if(!res.ok) throw new Error (data.error || "faild to cerate account");
          if(data.error)throw new Error (data.error);
          console.log(data);
          
          return data;
    }catch(err){
   console.log(err.message)
  
   throw err;
    }
  },
  onSuccess:()=>{
    toast.success("Account succesfuly created");
     query.invalidateQueries({ queryKey: ["auth"] });
  

  }
})
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailError="You are not provide correct email syntax"
const usernameError="username characters are not to be less than 5!,it to be unique"
const passwordError="password characters are not to be less than 6!"
function Submit(e){
   e.preventDefault();
   
    if((emailRegex.test(state.email)) && (state.username.length>=5) && (state.password.length>=6)){
     
   mutate(state)
    setError(false)
      setValid(false)
      setpassword(false);
}else{
    
( !emailRegex.test(state.email) ?  setError(true) : setError(false));

( state.username.length<5 ? setValid(true) :  setValid(false) );
( state.password.length<6 ? setpassword(true) :  setpassword(false) );
  }
}
  return (
    <div className='home-container-input'>
      <div className="x-icon">
        <XIcon className='xiconsignup'/>
      </div>
      <div className="form"> 
           <h2>Join today.</h2>
        <form >
          <div>
           <label htmlFor="email">< MailOutlineIcon /></label>
          <input onChange={SignUP} type="email" name= "email" id="email" placeholder='Email' required value={state.email}   style={{ borderColor: errorcheck && "red"}} />
          {errorcheck && <h1 style={{color: "red"}}>{emailError}</h1> }
            </div>
           
            <div>
             <label htmlFor="username"><PersonIcon/></label>
          <input onChange={SignUP} type="text" name="username" id="username" placeholder='Username' required value={state.username} style={{ borderColor: usernameValid && "red"}} />
          { usernameValid && <h1 style={{color: "red"}}>{usernameError}</h1> }
          </div>
            <div>
           <label htmlFor="fullname"><DriveFileRenameOutlineIcon/></label>
          <input onChange={SignUP} type="text" name="fullname" id="fullname" placeholder='Full name' required value={state.fullname}/>
          </div>

          <div>
          <label htmlFor="password"><PasswordIcon/></label>
          <input onChange={SignUP}  type="password" name="password" id="password" placeholder='Password' required value={state.password} style={{borderColor: passwordValid && "red"}} />
           { passwordValid && <h1 style={{color: "red"}}>{passwordError}</h1> }
          </div>
          {error && <h1 style={{color:"red"}}>{error.message}</h1> }
         
          <button onClick={Submit} type="submit" className='signup'>{isPending?"Lodding.." : "Sign Up"}</button>
       <p>Already have an an account?</p>    
     <Link to={"/login"}>     <button onClick={(e)=>{
            
            setState({
             email:"",
            username:"",
            fullname:"",
            password:""
            })
           
           }}  className='signin'>Sign in</button></Link> 
        </form>
      </div>
    </div>
  )
}
