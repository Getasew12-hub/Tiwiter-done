import express from "express";
import { signup ,login, logout, authUser } from "../controlers/auth.controler.js";
const router=express.Router();
import {Getme} from "../milddleware/getme.js";

router.get("/me",Getme)

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.get("/authUser",authUser);
router.get("/welcome",(req,res)=>{
    
    res.status(201).json("Succesfuly login")
})
router.get("/not",(req,res)=>{
    res.status(201).json("not login")
})


export default router;