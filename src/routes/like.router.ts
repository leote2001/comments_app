import { LikeController } from "../controllers/LikeController";
import { tokenMiddleware } from "../middleware/tokenMiddleware";
import express from "express";
export const likeRouter = express.Router();

const likeController = new LikeController();

likeRouter.get("/get-likes/:commentId", tokenMiddleware, likeController.getCommentsLikes);
likeRouter.post("/toggle-like", tokenMiddleware, likeController.toggleLike); 