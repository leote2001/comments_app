import express from "express";
import { FavoriteUserController } from "../controllers/FavoriteUserController";
import { tokenMiddleware } from "../middleware/tokenMiddleware";

export const favoriteUserRouter = express.Router(); 
const favoriteUserController = new FavoriteUserController();
// Get all
favoriteUserRouter.get("/get-all/:userId?", tokenMiddleware, favoriteUserController.getAll);
// Favorite button text
favoriteUserRouter.get("/btn-text/:favoriteId", tokenMiddleware, favoriteUserController.favoriteButtonText);
// Toggle favorite user
favoriteUserRouter.post("/toggle", tokenMiddleware, favoriteUserController.toggleFavoriteUser);
// Delete favorite user
favoriteUserRouter.post("/delete", tokenMiddleware, favoriteUserController.deleteFavoriteUser);