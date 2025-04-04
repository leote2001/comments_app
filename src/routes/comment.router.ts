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
// Get repost buttons text
commentRouter.get("/get-repost-btn-text/:commentId", tokenMiddleware, commentController.getRepostButtonsText);
// Repost
commentRouter.post("/repost", tokenMiddleware, commentController.repost);
// Get notifications
commentRouter.get("/notifications", tokenMiddleware, commentController.getNotifications);
// Get comment by id
commentRouter.get("/comment/:commentId", tokenMiddleware, commentController.getCommentById);
// Get private comments
commentRouter.get("/private-comments/:userId", tokenMiddleware, commentController.getPrivateComments);
// Private comment form
commentRouter.get("/private-form/:userId", tokenMiddleware, commentController.privateForm);
// Send private comment
commentRouter.post("/send-private", tokenMiddleware, commentController.sendPrivate); 
// Get private comment by id
commentRouter.get("/private-comment/:commentId", tokenMiddleware, commentController.getPrivateCommentById); 
// Private comment reply form
commentRouter.get("/private-reply-form/:commentId", tokenMiddleware, commentController.privateReplyForm);
// Private success
commentRouter.get("/private-success", tokenMiddleware, commentController.privateSuccess);