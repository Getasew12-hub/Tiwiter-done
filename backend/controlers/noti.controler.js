import db from "../db/dbmongo.js"

export const getNotification=async (req,res)=>{
    try{
        
       
const response=await db.query("SELECT notification.froms,notification.read,notification.type,userinfo.fullname,userinfo.username,profile.profileimg FROM notification LEFT JOIN userinfo ON userinfo.id=notification.froms LEFT JOIN profile ON profile.userid=notification.froms WHERE touser=$1   ORDER BY notification.id DESC;",[req.user.id])
if(response.rows.length<1)return res.status(200).json([])

res.status(200).json(response.rows)
       

    }catch(err){
           console.log("error on notification",err.message);
        res.status(500).json({error:"internal server error"});
    }
}

export const ReadNoti=async (req,res)=>{
    
try{
   await db.query("UPDATE notification SET read='read'WHERE touser=$1;",[req.user.id])
  
   return res.status(200).json("suceesfully update")
}catch(err){
  return res.status(500).json({error:"internal server error"})
}
}

export const UreadNoti=async (req,res)=>{
    try{
    const unread=await db.query("SELECT froms FROM notification WHERE touser=$1 AND read='unread';",[req.user.id]);
      console.log(unread.rows)
    return res.status(200).json(unread.rows);
    }catch(err){
      return res.status(500).json({error:"internal server error"});
    }
}
export const ClearNoti=async (req,res)=>{
    try{
    await db.query("DELETE FROM notification WHERE touser=$1;",[req.user.id]);
    return res.status(200).json("successfully deleted")
    }catch(err){
     return res.status(500).json({error:"internal server error"});
    }
}