import { Request, Response, NextFunction } from "express";
import { likeModel } from "../model/likeModel";
import { ILikeController } from "../interfaces";

export class LikeController implements ILikeController {
    async getCommentsLikes(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { commentId } = req.params;
            const user_id = (req as any).userId;
            const existingCommentLike = await likeModel.findOne({ userId: user_id, commentId });
            const commentLikes = await likeModel.countDocuments({ commentId });
            const like = existingCommentLike ? true : false;
            return res.status(200).json({ like, commentLikes });
        } catch (err: any) {
            next(err);
        }
    }
    async toggleLike(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { commentId } = req.body;
            const user_id = (req as any).userId;
            const existingCommentLike = await likeModel.findOne({ userId: user_id, commentId });
            let like;
            let commentLikes;
            if (!existingCommentLike) {
                await likeModel.create({ userId: user_id, commentId });
                commentLikes = await likeModel.countDocuments({ commentId });
                like = true;
            } else {
                await likeModel.deleteOne({ _id: existingCommentLike._id });
                commentLikes = await likeModel.countDocuments({ commentId });
                like = false;
            }
            return res.status(201).json({like, commentLikes});
        } catch (err: any) {
            next(err);
        }
    }
}