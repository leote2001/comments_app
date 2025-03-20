import { Request, NextFunction, Response } from "express";
import { ISearchController } from "../interfaces";
import { userModel } from "../model/user.model";

export class SearchController implements ISearchController {
    async search(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
        const q = req.query.q as string;
        const page = parseInt(req.query.page as string) || 1;
        const limit = 8;
        const skip = (page - 1) * limit; 
        if (!q.trim()) {
return res.status(400).json({message: "Please write any search term"});
        }
        const existingUsers = await userModel.find({
            username: {$regex: `^${q}`, $options: "i"}
        }).limit(limit).skip(skip).lean();
        const totalUsers = await userModel.countDocuments({username: {$regex: `^${q}`, $options: "i"}});
        const totalPages = Math.ceil(totalUsers / limit); 
        return res.status(200).json({existingUsers, currentPage: page, totalPages});
        } catch (err: any) {
            next(err);
        }
    }
}