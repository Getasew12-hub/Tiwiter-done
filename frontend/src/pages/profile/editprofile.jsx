import React, { useEffect, useRef, useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import "./profile.css";
import { Query, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Auth } from "../../controller/queryFn/queryFn";
function editprofile() {
  const {data:user,isLoading}=useQuery({queryKey:["auth"],queryFn:Auth,retry:false})
    const query=useQueryClient()
    const [state, setState] = useState({
    fullname: "",
    username: "",
    email: "",
    bio: "",
    currentpassword: "",
    newpassword: "",
    link: "",
  });
  const Stay = useRef();

const {mutate,isPending,error}=useMutation({
  mutationFn:async (state) => {
    try {
      const res=await fetch("https://tiwiter-done-1.onrender.com/user/user",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify(state),
        credentials:"include"
      })
       const data=await res.json();
   if (!res.ok) throw new Error(data.error || "something is wrong");
   return data;
    } catch (error) {
      throw new Error(error.message);
      
    }
  },
  onSuccess:(data,val)=>{
    console.log("value is......",val)
    toast.success("sussefully update")
      query.invalidateQueries({queryKey:["auth"]})
     query.invalidateQueries({queryKey:["peofile"]})
    setState({
       fullname: "",
    username: "",
    email: "",
    bio: "",
    currentpassword: "",
    newpassword: "",
    link: "",
    })
  },
  onError:()=>{
    toast.error("faild to update")
  },
 retry:false
})
if(isLoading) return <div>Loading...</div>

  function stay(e) {
    e.stopPropagation();
    e.preventDefault();
  mutate(state)
    
  
  }
  useEffect(()=>{
    if(user){
      setState({
        fullname:user.fullname,
        username:user.username,
        email:user.email,
        bio:user.bio,
        currentpassword:"",
        newpassword:"",
        link:user.link,
      })
    }
  },[user])
  function Value(e) {
    const { name, value } = e.target;
    setState((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }
  function Hide(){
    const edit=document.querySelector(".editprofile-container");
    edit.style.visibility="hidden"
  }
  return (
    <div className="editprofile-container" ref={Stay} >

      <div className="edit-content">
        <ClearIcon color="primary" style={{cursor:"pointer"}} onClick={Hide}/>
      <p>updet profile</p>
      <div className="editprofile">
        <form>
          <input
            type="text"
            name="fullname"
            id="fullname"
            placeholder="fullname"
            autoFocus
            value={state.fullname}
            onChange={Value}
          />
          <input
            type="text"
            name="username"
            id="username"
            placeholder="username"
            value={state.username}
            onChange={Value}
          />
          <input
          
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={state.email}
            onChange={Value}
          />

          <textarea
            name="bio"
            id="bio"
            placeholder="Bio"
            rows="1"
            value={state.bio}
            onChange={Value}
          ></textarea>
          <input
            type="password"
            name="currentpassword"
            id="currentpassword"
            placeholder="currentpassword"
            value={state.currentpassword}
            onChange={Value}
          />
          <input
            type="password"
            name="newpassword"
            id="newpassword"
            placeholder="newpassword"
            value={state.newpassword}
            onChange={Value}
          />
          <input
            className="link"
            type="text"
            name="link"
            id="link"
            placeholder="Link"
            value={state.link}
            onChange={Value}
          />
          {error && <span style={{color:"red",border:"none",whiteSpace:"nowrap"}} >{error.message}</span>}
          <button onClick={stay} className="update">
          {isPending ? "Loading...": "Update"}  
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default editprofile;
