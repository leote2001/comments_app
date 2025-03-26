import { Request, Response, NextFunction } from "express";
import { IFavoriteUserController } from "../interfaces";
import { favoriteUserModel } from "../model/favoriteUser.model";
import { userModel } from "../model/user.model";
import { notificationModel } from "../model/notification.model";

export class FavoriteUserController implements IFavoriteUserController {
    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = 10;
            const skip = (page - 1) * limit; 
            const userId = req.params.userId || (req as any).userId;
            const authUser = (req as any).userId;
            const userData = await userModel.findById(userId);
            const favoriteUsers = await favoriteUserModel.find({ userId }).populate("favoriteId").lean().skip(skip).limit(limit);
            const totalFavorites = await favoriteUserModel.countDocuments({userId});
            const totalPages = Math.ceil(totalFavorites / limit);
            res.render("favorites", { favoriteUsers, authUser, userData, currentPage: page, totalPages });
        } catch (err: any) {
            next(err);
        }
    }
    async favoriteButtonText(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { favoriteId } = req.params;
            const userId = (req as any).userId;
            const existingFavorite = await favoriteUserModel.findOne({ userId, favoriteId });
            let favorite = false;
            if (existingFavorite) {
                favorite = true;
            }
            return res.status(200).json({ favorite });
        } catch (err: any) {
            next(err);
        }
    }
    async toggleFavoriteUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { favoriteId } = req.body;
            const user_id = (req as any).userId;
            const existingFavorite = await favoriteUserModel.findOne({ userId: user_id, favoriteId });
            let favorite;
            if (!existingFavorite) {
                await favoriteUserModel.create({ userId: user_id, favoriteId });
                await notificationModel.create({userId: user_id, receiverId: user_id, favoriteId, type: "favorite"});
                favorite = true;
            } else {
                await favoriteUserModel.deleteOne({ _id: existingFavorite._id });
                await notificationModel.findOneAndDelete({userId: user_id, favoriteId});
                favorite = false;
            }
            return res.status(201).json({ favorite });
        } catch (err: any) {
            next(err);
        }
    }
    async deleteFavoriteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { favoriteId} = req.body;
            const authUser = (req as any).userId;
            
            const existingFavorite = await favoriteUserModel.findOne({ userId: authUser, favoriteId });
            if (!existingFavorite) {
                throw new Error();
            }
            await favoriteUserModel.findByIdAndDelete(existingFavorite._id);
            res.redirect("/favorite/get-all");           
        } catch (err: any) {
            next(err);
        }
    }
}