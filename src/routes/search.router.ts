import express from "express";
import { SearchController } from "../controllers/SearchController";
import { tokenMiddleware } from "../middleware/tokenMiddleware";

export const searchRouter = express.Router(); 
const searchController = new SearchController();

searchRouter.get("/", tokenMiddleware, searchController.search);