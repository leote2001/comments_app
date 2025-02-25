import { Request, Response, NextFunction } from "express";
import { ICommentController } from "../interfaces";
import { commentModel } from "../model/comment.model";
import { userModel } from "../model/user.model";

export class CommentController implements ICommentController {
    async index(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;
            const user_id = (req as any).userId;
            console.log("Está en async index");
            const userData = await userModel.findById(user_id);
            const allComments = await commentModel.find().populate("userId", "username").sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
            const totalComments = await commentModel.countDocuments();
            const totalPages = Math.ceil(totalComments / limit);
            if (!userData || !allComments) {
                throw new Error();
            }

            res.render("index", { allComments, userData, currentPage: page, totalPages, errors: [], oldData: {} });
        } catch (err: any) {
            next(err);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { content, source } = req.body;
            const view = source === "index" ? "index" : "profile";
            const user_id = (req as any).userId;
            if (!content.trim() || content.length > 180) {
                const errors: string[] = ["Empty comment or it's m    ore than 180 characters long"];
                try {
                    const page = parseInt(req.query.page as string) || 1;
                    const limit = 10;
                    const skip = (page - 1) * limit;
                    let allComments;
                    let totalComments; 
                    if (view === "index") {
                        allComments = await commentModel.find().sort({ createdAt: -1 }).populate("userId", "username").skip(skip).limit(limit).lean();
                        totalComments = await commentModel.countDocuments();
                    } else {
                        allComments = await commentModel.find({userId: user_id}).sort({ createdAt: -1 }).populate("userId", "username").skip(skip).limit(limit).lean();
                        totalComments = await commentModel.countDocuments({userId: user_id});
                    }
                    
                    const userData = await userModel.findById(user_id);
                    const oldData = { content };
                    const totalPages = Math.ceil(totalComments / limit); 
                    if (!allComments || !userData) {
                        throw new Error();
                    }
                    res.render(view, { allComments, userData, currentPage: page, totalPages, errors, oldData });
                    return;
                } catch (err: any) {
                    next(err);
                }
            }

            await commentModel.create({ userId: user_id, content });
            res.redirect(view === "index" ? "/" : "/profile");
        } catch (err: any) {
            next(err);
        }
    }
    async editForm(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const source = req.query.source;
            const { commentId } = req.params;
            const comment = await commentModel.findById(commentId);
            if (!comment) {
                const errors: string[] = ["comment not found"];
                res.render("errors", { errors });
                return;
            }
            res.render("edit", { comment, source, errors: [], oldData: {} });
        } catch (err: any) {
            next(err);
        }
    }
    async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { source, content, commentId } = req.body;
            if (!content.trim() || content.length > 180) {
                const errors: string[] = ["Empty comment or it's more than 180 characters long"];
                try {
                    const comment = await commentModel.findById(commentId);
                    const oldData = { content };
                    if (!comment) {
                        throw new Error();
                    }
                    res.render("edit", { comment, source, errors, oldData });
                    return;
                } catch (err: any) {
                    next(err);
                }
            }
            const updatedComment = await commentModel.findByIdAndUpdate(commentId, { content });
            console.log(updatedComment);
            if (!updatedComment) {
                const errors: string[] = ["Comment not found"];
                res.render("errors", { errors });
                return;
            }
            res.redirect(source === "index" ? "/" : "/profile");
        } catch (err: any) {
            next(err);
        }
    }
    async profile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;
            const user_id = (req as any).userId;
            const allComments = await commentModel.find({ userId: user_id }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
            const totalComments = await commentModel.countDocuments({userId: user_id});
            const totalPages = Math.ceil(totalComments / limit);
            const userData = await userModel.findById(user_id);
            if (!allComments || !userData) {
                throw new Error();
            }
            res.render("profile", { allComments, userData, currentPage: page, totalPages, errors: [], oldData: {} });
        } catch (err: any) {
            console.error(err.message);
            next(err);
        }
    }
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { source, commentId } = req.body;
            await commentModel.findByIdAndDelete(commentId);
            res.redirect(source === "index" ? "/" : "/profile");
        } catch (err: any) {
            next(err);
        }
    }
}