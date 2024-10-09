import express from 'express';
import {verifyToken} from "../utils/verifyUser.js";
import {createPost, deletePost, getPosts} from "../controllers/post.controller.js";
const router = express.Router();

router.post('/create',verifyToken,createPost)
router.get('/getPosts',getPosts)
router.delete('/deletepost/:postId/:userId',verifyToken,deletePost)

export default router;