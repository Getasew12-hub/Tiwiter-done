import db from "../db/dbmongo.js";
import {v2 as cloudinary} from "cloudinary"
export const userPost=async (req,res)=>{
  
    try{ 
         let {img,text}=req.body;
         if(!img && !text){
            return res.status(404).json({error:"post not found"})
         }
         
         if(img){
             const uploadResult = await cloudinary.uploader.upload(img);
                img=uploadResult.secure_url;
         }
         
    await db.query("INSERT INTO post (img,text,userid) VALUES($1,$2,$3);",[img,text,req.user.id])

    res.status(201).json({message:"succesfuly post apploid"})
    }catch(err){
        console.log("error on the userpost", err.message);
        res.status(500).json({error:"internal server error"})

    }
  
}

export const deletepost=async (req,res)=>{
    try{
        const id=req.params.id;
        const getuser=await db.query("SELECT userid,img FROM post WHERE id=$1;",[id])
       
        if(!(getuser.rows.length>0)){
            return res.status(404).json({message:"user not found"})
        }
        const user=getuser.rows[0].userid;
        if(user!==req.user.id)return res.status(404).json({error:"unauthorize user"})
       
          if(getuser.rows.img!=null){
           await cloudinary.uploader.destroy(getuser.rows[0].img.split("/").pop().split(".")[0])
          }
        await db.query("DELETE FROM likepost  WHERE postid=$1;",[id]);
        await db.query("DELETE FROM comments  WHERE postid=$1;",[id]);
        await db.query("DELETE FROM post  WHERE id=$1;",[id]);
        
        res.status(200).json({message:"successfuly deleted"})
      
    }catch(err){
        console.log("error on the deletepost",err.message)
        res.status(500).json({error:"internal server error"});
    }
}

export const commentPost=async (req,res)=>{
    try{
       
     
       const post=req.params.id;
       const {userComment}=req.body;
     
       if(!userComment){
        return res.status(404).json({error:"text is required"})
       }
     const user=await db.query("SELECT userid FROM post WHERE id=$1;",[post])
   
     await db.query("INSERT INTO comments(text,userid,postid,owner) VALUES($1,$2,$3,$4);",[userComment,req.user.id,post,user.rows[0].userid]);
     
     const updateComment=await db.query("SELECT c.*,u.fullname,u.username,p.profileimg FROM comments c LEFT JOIN userinfo u ON u.id=c.userid LEFT JOIN profile p ON p.userid=c.userid  WHERE postid=$1 AND owner=$2 ORDER BY id DESC;",[post,user.rows[0].userid])
    
     res.status(201).json(updateComment.rows)


    }catch(err){
        console.log("error on comment",err.message)
        res.status(500).json({error:"internal server error"});
    }
}

export const likeUnlikePost=async (req,res)=>{
    try{
        const post=req.params.id;
        const like=await db.query("SELECT * FROM likepost WHERE likepost=$1 AND postid=$2;",[req.user.id,post]);
        if(like.rows.length>0){
            await db.query("DELETE FROM likepost WHERE likepost=$1 AND postid=$2;",[req.user.id,post])
            const user=await db.query("SELECT userid FROM post WHERE id=$1",[post]);
            const noti=await db.query("SELECT * FROM notification WHERE froms=$1 AND touser=$2 AND type='Like';",[req.user.id,user.rows[0].userid])
            if(noti.rows.length>0){
                 await db.query("DELETE FROM notification WHERE froms=$1 AND touser=$2 AND type='Like';",[req.user.id,user.rows[0].userid])  
            }
            const UpdateUser=await db.query("SELECT likepost FROM likepost WHERE postid=$1",[post]);
            const getupdate=UpdateUser.rows.map((val)=> val.likepost)
                const waiteUpdate=await Promise.all(getupdate)
                
          return res.status(200).json(waiteUpdate)
        }else{
            
            const user=await db.query("SELECT userid FROM post WHERE id=$1",[post]);
           await db.query("INSERT INTO likepost(likepost,postid,owner) VALUES ($1,$2,$3);",[req.user.id,post,user.rows[0].userid])
              await db.query("INSERT INTO notification (froms,touser,type,read) VALUES ($1,$2,$3,$4);",[req.user.id,user.rows[0].userid,"Like","unread"])
                const UpdateUser=await db.query("SELECT likepost FROM likepost WHERE postid=$1",[post]);
                const getupdate=UpdateUser.rows.map((val)=> val.likepost)
                const waiteUpdate=await Promise.all(getupdate)
              
            return res.status(200).json(waiteUpdate)
        }
 
    }catch(err){
        console.log("error on like unlike",err.message);
        res.status(500).json({message:"internal server error"});
    }
}

export const allPost=async(req,res)=>{
    try{
        const post=await db.query("SELECT * FROM post ORDER BY id desc")
   const posts=post.rows;
       const userdetsil=posts.map(async(posts)=>{
          
        const userinfo=await db.query("SELECT u.username,u.fullname,u.email,p.* FROM userinfo u LEFT JOIN profile p ON u.id=p.userid WHERE u.id=$1;",[posts.userid]);

        const likes=await db.query("SELECT likepost,postid FROM likepost WHERE owner=$1 AND postid=$2;",[posts.userid,posts.id]);

      const comments=await db.query("SELECT c.*,u.fullname,u.username,p.profileimg FROM comments c LEFT JOIN userinfo u ON u.id=c.userid LEFT JOIN profile p ON p.userid=c.userid  WHERE postid=$1 AND owner=$2 ORDER BY c.id DESC;",[posts.id,posts.userid])

        return {
            ...posts,
            user:userinfo.rows[0],
            comment:comments.rows,
            like:likes.rows,
        }
       })

const getpost=await Promise.all(userdetsil);
   
      return  res.status(200).json(getpost);

    }catch(err){
         console.log("error on like unlike",err.message);
        res.status(500).json({error:"internal server error"});
    }
}

export const  likepost=async (req,res)=>{
    try{
        
        const num=await db.query("SELECT postid FROM likepost WHERE likepost=$1;",[req.user.id])
       
        const val=num.rows;
        const data=val.map((item)=> item.postid)
        const getdata=await Promise.all(data)
         
        res.status(200).json(getdata)

    }catch(err){
        console.log("error on like unlike",err.message);
        res.status(500).json({error:"internal server error"});  
    }
}

export const following=async (req,res)=>{
    try{
          const user=await db.query("SELECT following FROM folow WHERE userid=$1;",[req.user.id])
          if(user.rows.length<1){
            return res.status(200).json([])
          }
          const users=user.rows;
         

      const userfollow=users.map(async(user)=>{
        const folowpost=await db.query("SELECT * FROM post WHERE post.userid=$1 ;",[user.following]);
          if(folowpost.rows.length<1) return null
   
     
        return folowpost.rows;
           
        
        
      });

 const getpost=await Promise.all(userfollow);  

 const onlypost=getpost.filter((item)=>{
    return (item!=null)
 })
  
   const getonlypost=await Promise.all(onlypost)

   const postdata=getonlypost.flat()
const userdetsil=postdata.map(async(val)=>{
    
     const userinfo=await db.query("SELECT u.username,u.fullname,u.email,p.* FROM userinfo u LEFT JOIN profile p ON p.userid=u.id WHERE u.id=$1;",[val.userid]);

        const likes=await db.query("SELECT likepost,postid FROM likepost WHERE owner=$1 AND postid=$2;;",[val.userid,val.id]);

       const comments=await db.query("SELECT c.*,u.fullname,u.username,p.profileimg FROM comments c LEFT JOIN userinfo u ON u.id=c.userid LEFT JOIN profile p ON p.userid=c.userid  WHERE postid=$1 AND owner=$2 ORDER BY  id DESC;",[val.id,val.userid])
        return{
            ...val,
             user:userinfo.rows[0],
            like:likes.rows,
            comment:comments.rows

        }
    
})

const allpost=await Promise.all(userdetsil);
       
     return res.status(200).json(allpost);
    
  
    }catch(err){
          console.log("error on like unlike",err.message);
        res.status(500).json({error:"internal server error"});
    }
}

export const followId=async (req,res) => {
    try {
         const user=await db.query("SELECT following FROM folow WHERE userid=$1;",[req.user.id])
         const id=user.rows.map((val)=>{
            return val.following;
         })

         const getId= await Promise.all(id);

         return res.status(200).json(getId)
    } catch (error) {
        console.log("error on followid",error.message);
        return res.status(500).json({error:"internal server error"});
    }
}