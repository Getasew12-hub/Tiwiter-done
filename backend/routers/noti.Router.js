import express from "express";
import { Getme } from "../milddleware/getme.js";
import { getNotification } from "../controlers/noti.controler.js";
import { ReadNoti } from "../controlers/noti.controler.js"; 
import { UreadNoti } from "../controlers/noti.controler.js";
import { ClearNoti } from "../controlers/noti.controler.js";
const router=express.Router();
router.get("/",Getme,getNotification)
router.post("/update",Getme,ReadNoti)
router.get("/unread",Getme,UreadNoti)
router.delete("/delete",Getme,ClearNoti)

export default router;