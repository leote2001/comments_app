import { Request, Response, NextFunction } from "express";
import { likeModel } from "../model/likeModel";
import { ICommentController } from "../interfaces";
import { commentModel } from "../model/comment.model";
import { userModel } from "../model/user.model";
import { notificationModel } from "../model/notification.model";
import { favoriteUserModel } from "../model/favoriteUser.model";
import { privateCommentModel } from "../model/privateComment.model";
import { FavoriteUser } from "../types";

export class CommentController implements ICommentController {
    async index(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;
            const user_id = (req as any).userId;
            console.log("Está en async index");
            const userData = await userModel.findById(user_id);
            const allComments = await commentModel.find().populate("userId").populate("receiverId").sort({ createdAt: -1 }).skip(skip).limit(limit).lean().populate({
                path: "repostOf",
                populate: [{ path: "userId", select: "username" }, { path: "type" }]
            });

            const totalComments = await commentModel.countDocuments();
            const totalPages = Math.ceil(totalComments / limit);
            if (!userData || !allComments) {
                throw new Error();
            }

            res.render("index", { allComments, userData, currentPage: page, totalPages, errors: [], oldData: {} });
        } catch (err: any) {
            console.error("error index " + err.message);
            next(err);
        }
    }
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { content, source } = req.body;
            const view = source === "index" ? "index" : "profile";
            const authUser = (req as any).userId;
            if (!content.trim() || content.length > 180) {
                const errors: string[] = ["Empty comment or it's m    ore than 180 characters long"];
                try {
                    const page = parseInt(req.query.page as string) || 1;
                    const limit = 10;
                    const skip = (page - 1) * limit;
                    let allComments;
                    let totalComments;
                    let userData;
                    if (view === "index") {
                        allComments = await commentModel.find().sort({ createdAt: -1 }).populate("userId").skip(skip).limit(limit).lean();
                        totalComments = await commentModel.countDocuments();
                        userData = await userModel.findById(authUser);
                    } else {
                        allComments = await commentModel.find({
                            $or: [{ userId: source, receiverId: source }, { userId: { $ne: source }, receiverId: source, hidden: false }]


                        }).sort({ createdAt: -1 }).populate("userId").skip(skip).limit(limit).lean();
                        totalComments = await commentModel.countDocuments({
                            $or: [{ userId: source, receiverId: source }, { userId: { $ne: source }, receiverId: source, hidden: false }]
                        });
                        userData = await userModel.findById(source);
                    }
                    const oldData = { content };
                    const totalPages = Math.ceil(totalComments / limit);
                    if (!allComments || !userData) {
                        throw new Error();
                    }
                    res.render(view, { authUser: view != "index" ? authUser : null, allComments, userData, currentPage: page, totalPages, errors, oldData });
                    return;
                } catch (err: any) {
                    console.error(err.message);
                    next(err);
                }
            }
            if (source === "index") {
                await commentModel.create({ userId: (req as any).userId, receiverId: (req as any).userId, content, type: "new" });
                await notificationModel.create({ userId: (req as any).userId, receiverId: (req as any).userId, type: "new" });
            } else if (source.toString() == authUser.toString()) {
                await commentModel.create({ userId: authUser, receiverId: authUser, content, type: "new" });
                await notificationModel.create({ userId: authUser, receiverId: authUser, type: "new" });
            } else {
                await commentModel.create({ userId: (req as any).userId, receiverId: source, content, type: "post on" });
                await notificationModel.create({ userId: (req as any).userId, receiverId: source, type: "post on" });
            }

            res.redirect(view === "index" ? "/" : "/profile/" + source);
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
            res.redirect(source === "index" ? "/" : "/profile/" + source);
        } catch (err: any) {
            next(err);
        }
    }
    async profile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.userId || (req as any).userId;
            const authUser = (req as any).userId;
            const userData = await userModel.findById(userId);
            const page = parseInt(req.query.page as string) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;
            const allComments = await commentModel.find({
                $or: [{ userId, receiverId: userId }, { userId: { $ne: userId }, receiverId: userId, hidden: false }]
            }).skip(skip).limit(limit).lean().sort({ createdAt: -1 }).populate("userId").populate("receiverId").populate({
                path: "repostOf",
                populate: [{ path: "userId", select: "username" }, { path: "type" }]
            });
            const totalComments = await commentModel.countDocuments({
                $or: [{ userId, receiverId: userId }, { userId: { $ne: userId }, receiverId: userId, hidden: false }]
            });
            const totalPages = Math.ceil(totalComments / limit);
            res.render("profile", { authUser, allComments, userData, currentPage: page, totalPages, errors: [], oldData: {} });
        } catch (err: any) {
            next(err);
        }
    }
    async hidden(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { commentId, profileId } = req.body;
            const updatingHidden = await commentModel.findByIdAndUpdate(commentId, { hidden: true });
            console.log(updatingHidden);
            if (!updatingHidden) {
                throw new Error();
            }
            res.redirect("/profile/" + profileId);
        } catch (err: any) {
            next(err);
        }
    }
    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authUser = (req as any).userId;
            const { source, commentId } = req.body;
            if (source === "private") {
await privateCommentModel.findByIdAndDelete(commentId);
            } else {
            await commentModel.findByIdAndDelete(commentId);
            }
            res.redirect(source === "index" ? "/" : source === "private" ? "/private-comments/"+authUser : "/profile/" + source);
        } catch (err: any) {
            next(err);
        }
    }
    async getRepostButtonsText(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { commentId } = req.params;
            const existingComment = await commentModel.findOne({ userId: (req as any).userId, repostOf: commentId });
            let reposted = false;
            if (existingComment) {
                reposted = true;
            }
            return res.status(200).json({ reposted });
        } catch (err: any) {
            next(err);
        }
    }
    async repost(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { commentId, content } = req.body;
            const existingComment = await commentModel.findOne({ userId: (req as any).userId, repostOf: commentId });
            let reposted;
            if (!existingComment) {
                await commentModel.create({ userId: (req as any).userId, receiverId: (req as any).userId, content, repostOf: commentId, type: "repost" });
                await notificationModel.create({ userId: (req as any).userId, receiverId: (req as any).userId, repostOf: commentId, type: "repost" });
                reposted = true;
            } else {
                await commentModel.findByIdAndDelete(existingComment._id);
                await notificationModel.findOneAndDelete({ userId: (req as any).userId, repostOf: commentId });
                reposted = false;
            }
            return res.status(201).json({ reposted });
        } catch (err: any) {
            next(err);
        }
    }
    async getNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = 10;
            
            const authUser = (req as any).userId;
            const authUserComments = await commentModel.find({ userId: authUser }).select("_id");
            const authUserCommentsIds = authUserComments.map(comment => comment._id);
            const favorites = await favoriteUserModel.find({ userId: authUser });
            const favoritesIds = favorites.map(favorite => (favorite.favoriteId));
            const notifications0 = await notificationModel.find({
                    $or: [ 
                    { type: "new", userId: { $ne: authUser, $in: favoritesIds }},
                    { type: "repost", userId: { $ne: authUser, $in: favoritesIds } },
                    { type: "post on", userId: { $ne: authUser, $in: favoritesIds } },
                    { type: "favorite", userId: { $ne: authUser, $in: favoritesIds } },
                    { type: "private", userId: { $ne: authUser }, receiverId: authUser },
                    { type: "like", userId: { $ne: authUser }, commentId: { $in: authUserCommentsIds }}
                    ]
            }).populate("userId").populate("receiverId").populate({
                path: "repostOf",
                populate: { path: "userId", select: "username" }
            }).populate("favoriteId").lean().sort({ createdAt: -1 });
            const notifications = notifications0.filter(noti => favorites.some(fav => noti.createdAt >= fav.createdAt) ); 
            const totalNotifications = notifications.length;
            const lastIndex = page * limit;
            const firstIndex = lastIndex - limit;
            const paginated = notifications.slice(firstIndex, lastIndex);
            console.log(totalNotifications)
            const totalPages = Math.ceil(totalNotifications / limit);
            res.render("notifications", { notifications: paginated, currentPage: page, totalPages });
        } catch (err: any) {
            next(err);
        }
    }
    async getCommentById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { commentId } = req.params;
            const authUser = (req as any).userId;
            const comment = await commentModel.findById(commentId).populate("userId").populate("receiverId").populate("repostOf").populate({
                path: "repostOf",
                populate: [{ path: "userId", select: "username" }, { path: "type" }]
            });
            if (!comment) {
                throw new Error("Comment not found");
            }
            res.render("comment", { comment, authUser });
        } catch (err: any) {
            next(err);
        }
    }
    async getPrivateComments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = 10;
            const skip = (page - 1) * limit;
            const { userId } = req.params;
            const authUser = (req as any).userId;
            if (userId.toString() !== authUser.toString()) {
                throw new Error("Access denied");
            }
            const allComments = await privateCommentModel.find({ receiverId: authUser }).sort({ createdAt: -1 }).lean().populate("userId", "username").skip(skip).limit(limit);
            const totalComments = await privateCommentModel.countDocuments({ receiverId: authUser });
            const totalPages = Math.ceil(totalComments / limit);
            res.render("privateCommentsList", { allComments, authUser, currentPage: page, totalPages });
            //res.json({allComments})
        } catch (err: any) {
            next(err);
        }
    }
    async privateForm(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId } = req.params;
            const authUser = (req as any).userId;
            if (userId.toString() === authUser.toString()) {
                throw new Error();
            }
            const receiver = await userModel.findById(userId);
            res.render("privateForm", { receiver, authUser });
        } catch (err: any) {
            console.log(err);
            next(err);
        }
    }
    async sendPrivate(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, receiverId, content, title } = req.body;
            if (!title.trim()) {
                throw new Error();
            }

            await privateCommentModel.create({ userId, receiverId, title, content });
            await notificationModel.create({ userId, receiverId, type: "private" });
            res.redirect("/private-success");
        } catch (err: any) {
            next(err);
        }
    }
    async getPrivateCommentById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { commentId } = req.params;
            const receiver = (req as any).userId;
            const existingComment = await privateCommentModel.findById(commentId).populate("userId", "username");
            if (!existingComment) {
                throw new Error();
            }
            if (existingComment.receiverId.toString() !== receiver.toString()) {
                console.log("Access denied");
                throw new Error();
            }
            res.render("privateComment", { existingComment, receiver });
        } catch (err: any) {
            next(err);
        }
    }
    async privateReplyForm(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { commentId } = req.params;
            const authUser = (req as any).userId;
            const existingComment = await privateCommentModel.findById(commentId).populate("userId");
            if (!existingComment || existingComment.receiverId.toString() !== authUser.toString()) {
                throw new Error();
            }
            const receiver = existingComment.userId;
            const title = existingComment.title;
            const content = existingComment.content;
            res.render("privateReplyForm", { receiver, title, content, authUser });
        } catch (err: any) {
            next(err);
        }
    }
    privateSuccess(req: Request, res: Response, next: NextFunction): void {
        try {
            res.render("privateCommentSuccess");
        } catch (err: any) {
            next(err);
        }
    }
}