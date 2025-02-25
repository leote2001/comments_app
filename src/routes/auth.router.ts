import express from "express";
import { validateFormData } from "../middleware/validateFormData";
import { AuthController } from "../controllers/AuthController";
import { tokenMiddleware } from "../middleware/tokenMiddleware";
export const authRouter = express.Router();

const authController = new AuthController();
// Login
authRouter.get("/login", authController.loginForm);
authRouter.post("/login", validateFormData("login"), authController.login);
// Register
authRouter.get("/register", authController.registerForm);
authRouter.post("/register", validateFormData("register"), authController.register);
// Logout
authRouter.post("/logout", tokenMiddleware, authController.logout);