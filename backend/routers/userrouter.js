import express from "express";
import { Getme } from "../milddleware/getme.js";
import { suggestUser } from "../controlers/userControler.js";
import { updateProfile } from "../controlers/userControler.js";
import { UserProfile } from "../controlers/userControler.js";
import { folowunfollow } from "../controlers/userControler.js";
import { UserPost } from "../controlers/userControler.js";
import { Like } from "../controlers/userControler.js";
import { UpdateImg } from "../controlers/userControler.js";
const router=express.Router();

router.get("/profile/:user",Getme,UserProfile)
router.post("/folow/:id",Getme,folowunfollow);
router.get("/suggest",Getme,suggestUser)
router.post("/user",Getme,updateProfile)
router.get("/userpost/:id",Getme,UserPost)
router.get("/like/:id",Getme,Like)
router.post("/updateImg",Getme,UpdateImg)
export default router;