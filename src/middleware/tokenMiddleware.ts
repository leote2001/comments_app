import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt, { JwtPayload } from "jsonwebtoken";
const secret = process.env.SECRET_KEY as string;
export const tokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log("Dentro de tokenMiddleware");
    const token = req.cookies.token;
    if (!token) {
        console.log("dentro de condicional porque no encuentra token");
        res.redirect("/auth/login");
        console.log("No existe el token en la solicitud");
        return;
    }
    try {
        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
        (req as any).userId = decoded._id;
        next();
    } catch (err: any) {
        res.redirect("/auth/login");
    }
}