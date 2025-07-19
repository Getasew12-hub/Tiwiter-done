import React, { useRef, useState } from "react";
import "./middel.css";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ClearIcon from '@mui/icons-material/Clear';
import FavoriteIcon from "@mui/icons-material/Favorite";
import {  NavLink } from "react-router-dom";
import { Auth } from "../queryFn/queryFn";


function usersPost(pro) {
console.log("all post", pro.all);
  const [sttate, setState] = useState(true);
  const Comment=useRef()
  const [secondState, secondSetState] = useState(false);
  const query = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["auth"],queryFn:Auth,retry:false });
  const deletepost = useRef();
  const [userComment,setComment]=useState("")

  const { data: UserLike, isLoading: lod } = useQuery({
    queryKey: ["userLike"],
    queryFn: async () => {
      try {
        const res = await fetch("https://tiwiter-done-1.onrender.com/post/likepost", {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
      } catch (err) {
        throw new Error(err);
      }
    },
  });

  const { mutate, isPending, isError, Error: DeleteError } = useMutation({
    mutationFn: async (val) => {
      try {
        const res = await fetch(`https://tiwiter-done-1.onrender.com/post/delete/${val}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const resdata = await res.json();
        if (!res.ok) throw new Error(resdata.data);
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    onError: () => {
      toast.error("Failed to delete");
    },
    onSuccess: () => {
      toast.success("Successfully deleted");
      query.invalidateQueries({ queryKey: ["fetchPost"] });
    },
  });

  const {
    mutateAsync: Like,
    isPending: pending,
    data: Response,
  } = useMutation({
    mutationFn: async (val) => {
      try {
        const res = await fetch(`https://tiwiter-done-1.onrender.com/post/like/${val}`, {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
      } catch (err) {
        throw new Error(err);
      }
    },
    onSuccess: (ResponseData) => {
      
        
      query.setQueryData(['fetchPost'],(old)=>{
         
    return old.map((p)=>{
          if(p.id==pro.all.id){
          return {...p,like:ResponseData}
          }
          return p;
        })
      })

    },
    onError: (err) => {
      console.log(err)
      toast.error("Failed to Like", err.message);
    },
  });


  const {mutate:sendcomment,isPending:coProgress}=useMutation({
    mutationFn:async ({userComment,id})=>{
      
      try{
  const res=await fetch(`https://tiwiter-done-1.onrender.com/post/comment/${id}`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
    },
    body: JSON.stringify({userComment}),
    credentials:"include"
  })
  const data=await res.json();
   if (!res.ok) throw new Error(data.error || "something is wrong");
   return data;
      }catch(err){
       throw new Error(err.message);
      }
    },
    onSuccess:(updateComment)=>{
      
      
     setComment("")
      query.setQueryData(["fetchPost"],(old)=>{
        return old.map((p)=>{
          if(p.id==pro.all.id){
            return {
              ...p,
              comment:updateComment,
            }
          }
          return p;
        })
      })
    },
    onError:()=>{
      
      toast.error("Faild add comment")
    }
  })

  // Now, you can conditionally render based on the loading state
  if (isLoading || lod ) {
    return <div>Loading...</div>;
  }

  function Remove() {
    if (data.id === pro.all.userid) {
      deletepost.current.classList.toggle("diplayNot");
    }
  }

  function deleteuserpost(e) {
    console.log("delete post id ", e.target.id);
    mutate(e.target.id);
  }

  async function LikeUnlike(id) {
  
    await Like(id); // Use await here
  }

  function CommentShow(id){
   
   Comment.current.style.visibility="visible"
   
  }

  function CommentAdd(e){
       e.preventDefault();
       const id=pro.all.id;
       sendcomment({userComment,id})
  }

  return (
    <div className="allPosts-container">
    <div className="userProfile">
      <NavLink to={`/profile/${pro.all.user.userid}`}>   {pro.all.user.profileimg ? (
          <img src={pro.all.user.profileimg} alt="Profile" /> // Added alt prop for accessibility
        ) : (
          <div className="img">{pro.all.user.fullname.slice(0, 1)}</div>
        )}</NavLink> 
        {/* <div>
          <p className="name">
            {pro.all.user.fullname} <span>{pro.all.user.username}</span>
          </p>
         
        </div> */}
        
      </div>
     <div className="postText">  <p>{pro.all.text}</p></div>
      {/* {pro.all.img && ( */}
        // <div className="PostImag">
        //   <img src={pro.all.img} alt="Post" />{" "}
        //   {/* Added alt prop for accessibility */}
        // </div>
      {/* // )} */}
      <div className="Response">
        {/* <p>
          <ChatBubbleOutlineIcon style={{cursor:"pointer"}} onClick={()=>CommentShow(pro.all.id)} /> {pro.all.comment && pro.all.comment}
        </p> */}

        {/* <p>
          {UserLike?.includes(pro.all.id) ? ( // Added optional chaining for UserLike
            sttate ? (
              <FavoriteIcon
                onClick={() => {
                  setState(!sttate);
                  LikeUnlike(pro.all.id);
                }}
                id={pro.all.id}
                className="white"
              />
            ) : (
              <FavoriteBorderIcon
                onClick={() => {
                  setState(!sttate);
                  LikeUnlike(pro.all.id);
                }}
                id={pro.all.id}
                className="fivorite"
              />
            )
          ) : secondState ? (
            <FavoriteIcon
              onClick={() => {
                secondSetState(!secondState);
                LikeUnlike(pro.all.id);
              }}
              id={pro.all.id}
              className="white"
            />
          ) : (
            <FavoriteBorderIcon
              onClick={() => {
                secondSetState(!secondState);
                LikeUnlike(pro.all.id);
              }}
              id={pro.all.id}
              className="fivorite"
            />
          )}{" "}
          {pro.all.like && pro.all.like.length}{" "}
        </p> */}
        {/* <div className="more">
          <p onClick={Remove}>
            <MoreVertIcon />
          </p>
          {!isPending ? (
            <p
              className="delete diplayNot"
              onClick={deleteuserpost}
              id={pro.all.id}
              ref={deletepost}
            >
              Delete
            </p>
          ) : (
            <p>Loading...</p>
          )}
        </div> */}
      </div>
     <div className="modal-overlay" ref={Comment}  id={pro.all.id}>
      <div className="comment-containerforuser"   >
        {/* <div className="discription">
          <ClearIcon className="clear"onClick={()=> Comment.current.style.visibility="hidden"}/>
        <h1>COMMENTS</h1>
      {pro.all.comment && pro.all.comment.length>0 ? pro.all.comment.map((val,index)=>       <div key={index} className="CommentuserProfile">
        <div className="forSidebyside">
        {val.profileimg ? (
          <img src={val.profileimg} alt="Profile" style={{background:"transparent"}} /> 
        ) : (
          <div className="img">{val.fullname.slice(0, 1)}</div>
        )}
        <div>
          <p className="commentname">
            {val.fullname} <span>{val.username}</span>
          </p>
         </div>
        </div>
         <p className="text">{val.text}</p>
      </div>): <p>No comment yet😉 Be the first one😊 </p>}


        </div> */}
        <div className="form">
          <div className="usercover">
               {/* <div className="userProfile">
        {data.profileimg ? (
          <img src={data.profileimg} alt="Profile" /> 
        ) : (
          <div className="img">{data.fullname.slice(0, 1)}</div>
        )} */}
        {/* <div> */}
          {/* <p className="name"> */}
            {/* {data.fullname} <span>{data.username}</span> */}
          {/* </p> */}
          
        {/* </div> */}
      {/* </div> */}
           
             </div>
          <form >
            <textarea  name="comment"   rows={"3"} placeholder="Add your comment" value={userComment} onChange={(e)=> setComment(e.target.value)}></textarea>
           
           <button onClick={CommentAdd}>{coProgress?"Loading":"Post"}</button>
          </form>
        </div>
      </div>
      </div>

    </div>
  );
}

export default usersPost;