import { Request, Response, NextFunction } from "express";
export interface IAuthController {
    loginForm(req: Request, res: Response, next: NextFunction): void;
    login(req: Request, res: Response, next: NextFunction): Promise<void>;
    registerForm(req: Request, res: Response, next: NextFunction): void;
    register(req: Request, res: Response, next: NextFunction): Promise<void>;
    logout(req: Request, res: Response, next: NextFunction): void;
}

export interface ICommentController {
    index(req: Request, res: Response, next: NextFunction): Promise<void>;
    create(req: Request, res: Response, next: NextFunction): Promise<void>;
    editForm(req: Request, res: Response, next: NextFunction): Promise<void>;
    edit(req: Request, res: Response, next: NextFunction): Promise<void>;
    profile(req: Request, res: Response, next: NextFunction): Promise<void>;
    delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export interface ILikeController {
    getCommentsLikes(req: Request, res: Response, next: NextFunction): Promise<any>;
    toggleLike(req: Request, res: Response, next: NextFunction): Promise<any>;
}