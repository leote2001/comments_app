import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { IAuthController } from "../interfaces";
import bcrypt from "bcrypt";
import { userModel } from "../model/user.model";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

const secret = process.env.SECRET_KEY as string;

export class AuthController implements IAuthController {
    loginForm(req: Request, res: Response, next: NextFunction): void {
        try {
            const num1 = Math.floor(Math.random() * (10 - 1 + 1) + 1);
            const num2 = Math.floor(Math.random() * (10 -1 + 1) + 1);
            const result = num1 + num2;
            const token = req.cookies.token;
            if (token) {
                try {
                jwt.verify(token, secret);
                res.redirect("/");
                return;
                } catch (err: any) {
                    res.render("login", {errors: [], oldData: {}, num1, num2, result});
return;
                }
            }
            res.render("login", {errors: [], oldData: {}, num1, num2, result});
        } catch (err: any) {
            next(err);
        }
    }
    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            const userExists = await userModel.findOne({ email });
            let comparePassword;
            if (userExists) {
                comparePassword = await bcrypt.compare(password, userExists.password);
            }
            if (!userExists || !comparePassword) {
                const errors: string[] = ["Authentication error"];
                res.render("errors", { errors });
                return;
            }
            const { _id } = userExists;
            const token = jwt.sign({_id}, secret, { expiresIn: "1h" });
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production"
            });
            res.redirect("/");
        } catch (err: any) {
            next(err);
        }
    }
    registerForm(req: Request, res: Response, next: NextFunction): void {
        try {
            const num1 = Math.floor(Math.random() * (10 - 1 + 1) + 1);
            const num2 = Math.floor(Math.random() * (10 - 1 + 1) + 1);
            const result = num1 + num2;
            const token = req.cookies.token;
            if (token) {
                try {
jwt.verify(token, secret);
res.redirect("/");
return;
                } catch (err: any) {
                    res.render("register", {errors: [], oldData: {}, num1, num2, result});
                    return;
                }
            }
            res.render("register", {errors: [], oldData: {}, num1, num2, result});
        } catch (err: any) {
            next(err);
        }
    }
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
try {
const {username, email, password } = req.body;
console.log("datos del formulario");
const userExists = await userModel.findOne({
$or: [{email}, {username}]
});
if (userExists) {
    console.log("user already exists");
    const errors: string[] = ["User already exists"];
    res.render("errors", {errors});
    return;
}
const hashedPassword = await bcrypt.hash(password, 10);
await userModel.create({username, email, password: hashedPassword});
res.redirect("/auth/login");
} catch (err: any) {
    next(err);
}
    }
    logout(req: Request, res: Response, next: NextFunction): void {
 try {
res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
});
res.redirect("/auth/login");
 }        catch (err: any) {
    next(err);
 }
    }
}