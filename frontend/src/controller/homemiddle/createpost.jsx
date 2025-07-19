import React, { useRef, useState } from 'react'

import "./middel.css"
import ImageIcon from '@mui/icons-material/Image';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ClearIcon from '@mui/icons-material/Clear';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import SmallLoading from '../skeleton/amllLoading';
import { FeachPost } from '../queryFn/queryFn';
import { Auth } from '../queryFn/queryFn';
function Createpost(pro) {
  const [text,setText]=useState("");
  const[img ,setimg]=useState(null)
  const imgRef=useRef();
  const readImg=useRef();
  const clear=useRef();
  const {data,isLoading,error}=useQuery({queryKey:["auth"],queryFn:Auth});
  const query=useQueryClient();
  
const {mutate,isPending,isError}=useMutation({
 
  mutationFn:async ({img,text})=>{
    console.log("i am call")
    try{
     const res=await fetch("http://localhost:5000/post/userpost",{
      method:"POST",
      headers:{
         "Content-Type":"application/json",
      },
      body: JSON.stringify({img,text}),
      credentials:"include"
     })
     const resdata=await res.json();
     if(!res.ok) throw new Error(resdata.err);
     return resdata;
    }catch(err){
      console.log(err.message)
    throw new Error(err);
    }
  },
  onSuccess:()=>{
    toast.success("Successfully created post");
    query.invalidateQueries({queryKey:["fetchPost"]})
  }
})

    function Display(e){
       const file=e.target.files[0];
       if(file){
        const render=new FileReader()
        render.readAsDataURL(file);
        render.onload=(e)=>{
           
            setimg(e.target.result)
            readImg.current.src=e.target.result;
            readImg.current.removeAttribute("hidden")
            clear.current.style.display="block"
            
        }
       }
    }
       
    function Clear(){
        readImg.current.src=null;
        
            readImg.current.setAttribute("hidden","true")
            clear.current.style.display="none"
    }
    function Posttext(e){
       const {value}=e.target;
           setText(value);
           
    }
    function Send(e){
      e.preventDefault();
        console.log(text)
        console.log(img)
      mutate({img,text})
    }
   
  return (
    <div>
      <div className="createpost-con">
     
        <div className="createpost">
      {data.profileimg?<img src={data.profileimg} alt="" /> :<div className='replaceimg'>{data.fullname.slice(0,1)}</div>}
            

            <textarea name="postText"   id="posttext" placeholder="What's is happning?" onChange={Posttext} value={text}></textarea>
            
        </div>
        <div className='displayajust'>
        <div className='diplayimg'><img  hidden ref={readImg} />
            <ClearIcon className='clear' ref={clear} style={{display:"none"}} onClick={Clear}/> 
        </div></div>

        <div className="post-apploader">
            <div className="take-image">
                <ImageIcon className='image' onClick={()=> imgRef.current.click() }/>
                <SentimentSatisfiedAltIcon/>
            </div>
            <input type="file" name="image" ref={imgRef} id="image" accept='image/*' hidden onChange={Display}/>
            <button onClick={Send}>{isPending?<SmallLoading/>:"Post"}</button>
        </div>
      </div>
    </div>
  )
}

export default Createpost;
