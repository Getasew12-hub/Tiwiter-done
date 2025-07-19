import express from "express";
import { Getme } from "../milddleware/getme.js";
import { userPost } from "../controlers/postcontroller.js";
import { deletepost } from "../controlers/postcontroller.js";
import { commentPost } from "../controlers/postcontroller.js";
import { likeUnlikePost } from "../controlers/postcontroller.js";
import { allPost } from "../controlers/postcontroller.js";
import { likepost } from "../controlers/postcontroller.js";
import { following } from "../controlers/postcontroller.js";
import { followId } from "../controlers/postcontroller.js";
const router=express.Router();
router.get("/likepost",Getme,likepost)
router.get("/following",Getme,following)
router.get("/all",Getme,allPost)
router.post("/userpost",Getme,userPost);
router.post("/like/:id",Getme,likeUnlikePost);
router.post("/comment/:id",Getme,commentPost);
router.delete("/delete/:id",Getme,deletepost);
router.get("/followId",Getme,followId)
export default router;