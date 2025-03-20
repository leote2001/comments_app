import express from "express";
import { CommentController } from "../controllers/CommentController";
import { tokenMiddleware } from "../middleware/tokenMiddleware";
export const commentRouter = express.Router();

const commentController = new CommentController();
// Index
commentRouter.get("/", tokenMiddleware, commentController.index);
// Create
commentRouter.post("/create", tokenMiddleware, commentController.create);
// Edit form
commentRouter.get("/:commentId/edit", tokenMiddleware, commentController.editForm);
// Edit
commentRouter.post("/edit", tokenMiddleware, commentController.edit);
// Profile
commentRouter.get("/profile/:userId?", tokenMiddleware, commentController.profile);
// Delete
commentRouter.post("/delete", tokenMiddleware, commentController.delete);
// Hidden
commentRouter.post("/hidden", tokenMiddleware, commentController.hidden);