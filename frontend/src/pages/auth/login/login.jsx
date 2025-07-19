import React from 'react'
import {Link} from "react-router-dom"
import "./login.css"
import XIcon from '@mui/icons-material/X';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PasswordIcon from '@mui/icons-material/Password';
import { useMutation,useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';



function login() {
const query=useQueryClient()

  const {mutate,isPending,isError,error}=useMutation({
  mutationFn:async({username,password})=>{
    try{

    const res=await fetch("http://localhost:5000/auth/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify({username,password}),
    credentials:'include'
    })

    const data=await res.json();
      console.log("user loggin",data);
    if(!res.ok) throw new Error (data.error ||"faild to login");
    return data;
  
    }catch(err){
      console.log(err.message);
    
      throw err;
    }
  },
  onSuccess:()=>{
    toast.success("Succesfuly login")
     query.invalidateQueries({ queryKey: ["auth"] });
    // navigat("/")
  }
});
         const [state,setState]=React.useState({
             username:"",
              password:""
         })
     
  function SignUP(event){
     const {name,value}=event.target;
      setState((prev)=>{
        return  {
              ...prev,
              [name]:value,
        }
     
      }) 
  }
  
  function Submit(e){
     e.preventDefault();
     mutate(state);
   
  }
  return (
    <div className='home-container-input'>
        <div className="x-icon">
        <XIcon className='xiconsignup'/>
      </div>
      <div className="form"> 
           <h2>Let's go.</h2>
        <form >
          <div>
           <label htmlFor="email">< MailOutlineIcon /></label>
          <input onChange={SignUP} type="email" name= "username" id="email" placeholder='Email' required value={state.email} />
         
            </div>
           

          <div>
          <label htmlFor="password"><PasswordIcon/></label>
          <input onChange={SignUP}  type="password" name="password" id="password" placeholder='Password' required value={state.password} />
          </div>
          {error && <p style={{color:"red"}}>{error.message}</p>}
          <button onClick={Submit} type="submit" className='signup'>{isPending?"Lodding..." :"Sign In"}</button>
       <p>Don't have an an account?</p>    
     <Link to={"/signup"}>     <button onClick={(e)=>{
            
            setState({
                 email:"",
            username:"",
            fullname:"",
            password:""
            })
           
           }} className='signin'>Sign Up</button></Link> 
        </form>
      </div>
    </div>
  )
}

export default login
