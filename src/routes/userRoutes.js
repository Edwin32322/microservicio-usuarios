import { Router } from "express";
import { userController } from "../controllers/userController.js";

const userRoutes = Router();

userRoutes.get("/", userController.getAllUser);

export default userRoutes;