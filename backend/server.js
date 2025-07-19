import express from "express";
import env from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import authRouter from "./routers/auth.routher.js"
import userRouter from "./routers/userrouter.js"
import { v2 as cloudinary } from 'cloudinary';
import postRouter from "./routers/postRouter.js"
import notificationRouter from "./routers/noti.Router.js"
import cors from "cors"

  env.config();
  const app=express();

app.use(session({
    secret:"TOPSECTER",
    resave:false,
    saveUninitialized:false,
    name:"usercome",
    cookie:{
        maxAge:24*15*60*60*1000,
        path:"/",
      
    }
}))

  cloudinary.config({ 
        cloud_name: process.env.CLOUND_NAME, 
        api_key: process.env.CLOUND_API_KEY, 
        api_secret:process.env.CLOUND_SECRET_KEY,// Click 'View API Keys' above to copy your API secret
    })

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: 'http://localhost:3000', // <--- IMPORTANT: Allow your frontend origin
    credentials: true, // <--- Allow cookies/sessions to be sent
}));

app.use(express.json({limit:"12mb"}))
app.use(express.urlencoded({extended:true}))
const port=5000;
app.use("/auth",authRouter);
app.use("/user",userRouter);
app.use("/post",postRouter)
app.use("/notification",notificationRouter)
passport.serializeUser((user,cb)=>{
    cb(null,user);
})
passport.deserializeUser((user,cb)=>{
    cb(null,user);
})
app.listen(port,()=>{
    console.log(`your server is running on port:${port}`);
  
    
})