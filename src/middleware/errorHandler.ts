import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = ["Unexpected error"];
    res.render("errors", {errors});
}