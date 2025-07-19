import express, { json } from "express";
import db from "../db/dbmongo.js";


import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";

const saltRound=10;


export const signup=async (req,res)=>{
     
    const {username,password,fullname,email}=req.body;
   try{
        const userexsts=await db.query("SELECT * FROM userinfo WHERE username=$1;",[username]);
        const emailexsts=await db.query("SELECT * FROM userinfo WHERE email=$1;",[email]);
        if(userexsts.rows.length>0){
          return  res.status(404).json({error:"username is taken"})
        }
        if(emailexsts.rows.length>0){
          return  res.status(404).json({error:"Email is alrady exist"})   
        }
       if(!password || !username || !fullname || !email) return res.status(404).json({error:"all place is required  input"});

          bcrypt.hash(password,saltRound,async(err,hash)=>{
            if(err){
                return res.status(500).json({message:"Internal server error"});
            }else{
               const response= await db.query("INSERT INTO userinfo(USERNAME,FULLNAME,EMAIL,PASSWORD) VALUES($1,$2,$3,$4) RETURNING *;",[username,fullname,email,hash]);
               const value=response.rows[0];
               await db.query("INSERT INTO profile (profileimg,coverimg,bio,link,userid) VALUES(NULL,NULL,NULL,NULL,$1);",[value.id])
               const allget=await db.query("SELECT userinfo.id,userinfo.password,userinfo.fullname,userinfo.email,userinfo.username,profile.profileimg,profile.coverimg,profile.bio,profile.link FROM userinfo JOIN profile ON profile.userid=userinfo.id  WHERE userinfo.id=$1;",[value.id])
                  const user=allget.rows[0];
                 
               req.login(user,(err)=>{
                if(err){
                     return res.status(500).json({message:"Internal server error"});

                }else{
                    return res.status(200).json(user);
                }
               })

            }
        })

        
        

   }catch(err){
       console.error("Error during signup:", err);
       res.status(500).json({ error: "Internal server error" });
   }
};
export const login= async(req,res)=>{
  
   
    const {username,password}=req.body;
      try{
     const response=await db.query("SELECT * FROM userinfo WHERE email=$1;",[username]);


      const allget=await db.query("SELECT userinfo.id,userinfo.password,userinfo.fullname,userinfo.email,userinfo.username,profile.profileimg,profile.coverimg,profile.bio,profile.link FROM userinfo LEFT JOIN profile ON profile.userid=userinfo.id  WHERE userinfo.email=$1;",[username])



     if(response.rows.length>0){
        const user=allget.rows[0];
        const getpassword=response.rows[0].password;

        bcrypt.compare(password,getpassword,(err,result)=>{
            if(err){
              
               return res.status(404).json({error:"internal server proplem"})
            }else{
                if(result){

                 req.login(user,(err)=>{
                    if(err){
                        return res.status(500).json({message:"Internal server error"});
                    }{
                    return  res.status(200).json(user)}
                 })   
                 
                }else{
                    return res.status(404).json({error:"Incorrect password"})


                }
            }
        })
     }else{
        return res.status(404).json({error:"Email is not found"})
     }

   }catch(error){
    console.log("error on login",error.message);
   return res.status(404).json(error.message);
   }
}
export const logout=async (req,res)=>{

    req.logout((err)=>{
        if(err){
           return  res.status(404).json({message:"error to log out"})
        }

    
              req.session.destroy((err)=>{
            if(err){
                console.log("error on destory session",err.message);
                return res.status(500).json({message:"Internal server error"})
            }
                  res.clearCookie("usercome",{path:"/"})  
                  return res.status(200).json("succesfuly log out");
            })

            
        
    })


};


export const authUser=async(req,res)=>{
  
       try{
        
        if(req.user){
             const allget=await db.query("SELECT userinfo.id,userinfo.password,userinfo.fullname,userinfo.email,userinfo.username,profile.profileimg,profile.coverimg,profile.bio,profile.link FROM userinfo LEFT JOIN profile ON profile.userid=userinfo.id  WHERE userinfo.id=$1;",[req.user.id])
         
            res.status(200).json(allget.rows[0]);
          
         }else{
            res.status(401).json({error:"you are not authenticated"})
         }
       }catch(err){
           console.log("error on authnticat lovvvv user",err.message);
           res.status(500).json(err.message)
       }
}


