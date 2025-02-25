import express, { Express } from "express";
import { authRouter } from "../routes/auth.router";
import path from "path";
import cookieParser from "cookie-parser";
import { errorHandler } from "../middleware/errorHandler";
import { commentRouter } from "../routes/comment.router";
export const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../../views"));
app.use("/", commentRouter);
app.use("/auth", authRouter);
app.use(errorHandler);