import db from "../db/dbmongo.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";



export const UserProfile=async(req,res)=>{
    const {user}=req.params;
  
    try{
     
     const response=await db.query("SELECT u.fullname,u.id ,u.username FROM userinfo u WHERE u.id=$1;",[user]);

     const profile=await db.query("SELECT p.profileimg,p.coverimg,p.bio,p.link FROM profile p WHERE p.userid=$1; ",[user])
     const following= await db.query("SELECT following FROM folow WHERE userid=$1;",[user])
     const follows=await db.query("SELECT followers FROM followers WHERE userid=$1;",[user])
      const post=await db.query("SELECT * FROM post WHERE userid=$1;",[user])
     const data=[];
     data.push(response.rows);
     data.push(profile.rows);
    

   const userinfo=data.flat() 
    userinfo.push({following:following.rows});
     userinfo.push({follows:follows.rows});  
     userinfo.push({post:post.rows})
  

     if(userinfo.length>0){
        res.status(200).json(userinfo)
     }else{
   res.status(404).json({error:"user not found"})
     }
    }catch(err){
     console.log("error in the userprofile",err.message);
     res.status(500).json({error:"Internal server error"});
    }
}
export const folowunfollow=async(req,res)=>{

  try{

 
    const id=parseInt(req.params.id);
    const usermodify=await db.query("SELECT * FROM userinfo WHERE id=$1",[id]);
  
   const curentuser=await db.query("SELECT following FROM folow WHERE userid=$1",[req.user.id])


    if(req.user.id===id){
        return res.status(400).json({error:"you can not follow yourself"})
    }   
    if(!req.user || !id){
        return res.status(400).json({error:"Invalid request"})
    }

    const isFolllow=curentuser.rows.find(user=> user.following==id);
    if(isFolllow==null){
        //folllow
        await db.query("INSERT INTO folow(following,userid) VALUES($1,$2) ",[id,req.user.id])
        await db.query("INSERT INTO followers(followers,userid) VALUES($1,$2);",[req.user.id,id])
        await db.query("INSERT INTO notification(froms,touser,type,read) VALUES($1,$2,$3,$4);",[req.user.id,id,"Follow","unread"]);
        
      return  res.status(200).json({message:"You are succesfuly follow user"})

    }else{
        //unfloolow
        await db.query("DELETE FROM folow WHERE following=$1",[id])
         await db.query("DELETE FROM followers WHERE followers=$1;",[req.user.id])
         await db.query("DELETE FROM notification  WHERE froms=$1 AND touser=$2 AND type=$3;",[req.user.id,id,"Follow"]);
       return  res.status(200).json({message:"You are succesfuly unfollow user"})
    };

     }catch(err){
      console.log("error on followunfolow",err.message);
      return res.status(500).json({error:"internal server error"})
     }
}

export const suggestUser=async (req,res)=>{
  try{ 
    const userfollow=await db.query("SELECT following FROM folow WHERE userid=$1;",[req.user.id])
    const selectuser=await db.query("SELECT u.fullname,u.username,u.id, p.profileimg FROM userinfo u LEFT JOIN profile p ON p.userid=u.id WHERE u.id!=$1;",[req.user.id]);
            
    userfollow.rows.forEach((folow)=>{
      
     selectuser.rows =selectuser.rows.filter((user)=> user.id!=folow.following)

  })
  if(selectuser.rows.length>4){
  const random=Math.floor(Math.random()*(selectuser.rows.length-4));
 

     const sugestusers=selectuser.rows.slice(random,random+4)
 
 return  res.status(200).json(sugestusers)

}else{
  
   const sugestusers=selectuser.rows.splice(0,4)
 
 return  res.status(200).json(sugestusers)
}
  }catch(err) {
    console.log(err.message);
    res.status(500).json({error:"Internal server error"})
  }    
       
}

export const updateProfile=async (req,res)=>{
    const saltRound=10;
   
    let {fullname,currentpassword,username,email,newpassword,bio,link,profileimage,coverimage}=req.body;
    console.log(req.body)
    try{
        
        if((currentpassword && !newpassword) || (newpassword && !currentpassword )) return res.status(404).json({error:"you must input both password"});
      
            if(currentpassword){
           const result=await  bcrypt.compare(currentpassword,req.user.password)
                 
                if(!result){
                     
                   return res.status(404).json({error:"your password is not match"});
                   
                    }

                }
      
if(newpassword){
     if(newpassword.length<6) return res.status(404).json({error:"password at least 6 character"});
       bcrypt.hash(newpassword,saltRound,async(err,hash)=>{
              await db.query("UPDATE userinfo SET password=$1 WHERE id=$2;",[hash,req.user.id]);
        })
    }
        if(profileimage){
            if(req.user.profileimage){
                // Delete the old profile image from Cloudinary 
          
               await cloudinary.uploader.destroy(user.profileimage.split('/').pop().split('.')[0]);
            }
                const uploadResult = await cloudinary.uploader.upload(profileimage);
                profileimage=uploadResult.secure_url;

        }
         
       
        if(coverimage){
           
            if(req.user.coverimage){
                // Delete the old cover image from Cloudinary 
               await cloudinary.uploader.destroy(user.coverimage.split('/').pop().split('.')[0]);
            }
              const uploadResult = await cloudinary.uploader.upload(coverimage);
              coverimage=uploadResult.secure_url;
        }
      
         const bi=bio || req.user.bio;
         const lin=link || req.user.link;
         const funame=fullname || req.user.fullname;
         const userN=username || req.user.username;
         const ema=email || req.user.email;
        await db.query("UPDATE profile SET  bio=$1, link=$2  WHERE userid=$3;",[bi,lin,req.user.id])
        await db.query("UPDATE  userinfo SET fullname=$1,username=$2,email=$3 WHERE id=$4 ;",[funame,userN,ema,req.user.id]);
        res.status(200).json({message:"Profile updated successfully"})
      
      
    

        }catch(err){
            console.log("error on the updateprofile",err.message);
            res.status(500).json({error:"Internal server error"})
        }


}
export const UserPost=async (req,res)=>{
  const {id}=req.params;
  try{

  const post=await db.query("SELECT * FROM post WHERE userid=$1 ORDER BY id DESC;",[id])
  const posts=post.rows;
  const userinfo= posts.map(async(val)=>{
const user=await db.query("SELECT u.fullname,u.username,u.id,p.profileimg FROM userinfo u LEFT JOIN profile p ON p.userid=u.id WHERE u.id=$1;",[val.userid]);

const like=await db.query("SELECT likepost FROM likepost WHERE postid=$1  AND owner=$2;",[val.id,val.userid]);



   const comment=await db.query("SELECT c.*,u.fullname,u.username,p.profileimg FROM comments c LEFT JOIN userinfo u ON u.id=c.userid LEFT JOIN profile p ON p.userid=c.userid  WHERE postid=$1 AND owner=$2;",[val.id,val.userid])

return {
  ...val,
  user:user.rows[0],
  like:like.rows,
  comment:comment.rows,

}
})

const getInfo=await Promise.all(userinfo);

return res.status(200).json(getInfo)
  }catch(err){
   return res.status(500).json({error:"internal server error"})
  }
}
export const Like=async (req,res)=>{

  try{
    const {id}=req.params;
  
      const response=await db.query("SELECT * FROM likepost WHERE likepost=$1 ORDER BY id DESC;",[id])
      const posts=response.rows;
  const userinfo= posts.map(async(val)=>{
const post=await db.query("SELECT * FROM post WHERE id=$1;",[val.postid])
const user=await db.query("SELECT u.fullname,u.username,u.id,p.profileimg FROM userinfo u LEFT JOIN profile p ON p.userid=u.id WHERE u.id=$1;",[val.owner]);

const like=await db.query("SELECT likepost FROM likepost WHERE postid=$1  AND owner=$2;",[val.postid,val.owner]);



   const comment=await db.query("SELECT c.*,u.fullname,u.username,p.profileimg FROM comments c LEFT JOIN userinfo u ON u.id=c.userid LEFT JOIN profile p ON p.userid=c.userid  WHERE postid=$1 AND owner=$2;",[val.postid,val.owner])

return {
  ...post.rows[0],
  user:user.rows[0],
  like:like.rows,
  comment:comment.rows,

}
})
const getInfo=await Promise.all(userinfo);
    
   return res.status(200).json(getInfo)
  }catch(err){
    console.log(err.message)
return res.status(500).json({error:"internal server error"})
  }
}


export const UpdateImg=async (req,res)=>{

  try{
    let {profileimage,coverimage}=req.body
             
            if(profileimage){
        
            if(req.user.profileimg){
                // Delete the old profile image from Cloudinary 
         
               await cloudinary.uploader.destroy(req.user.profileimg.split('/').pop().split('.')[0]);
            }
                const uploadResult = await cloudinary.uploader.upload(profileimage);
                profileimage=uploadResult.secure_url;

        }
         
       
        if(coverimage){
          
            if(req.user.coverimg){
                // Delete the old cover image from Cloudinary 
                 
               await cloudinary.uploader.destroy(req.user.coverimg.split('/').pop().split('.')[0]);
            }
              const uploadResult = await cloudinary.uploader.upload(coverimage);
              coverimage=uploadResult.secure_url;
        }
        const prifileImage=profileimage || req.user.profileimg;
        const cover=coverimage || req.user.coverimg;

     const update=await db.query("UPDATE profile SET profileimg=$1,coverimg=$2 WHERE userid=$3 RETURNING profileimg,coverimg;",[prifileImage,cover,req.user.id])
   
     return res.status(200).json(update.rows[0])
    
  }catch(err){
    console.log("error on updapro",err.message)
  return res.status(500).json({error:"internal server error"})
  }
}