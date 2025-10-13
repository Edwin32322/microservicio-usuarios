import { Router } from "express";
import { userController } from "../controllers/userController.js";

const userRoutes = Router();

userRoutes.get("/", userController.getAllUsers);
userRoutes.post("/", userController.createUser)
userRoutes.post("/delete-users", userController.deleteUsers)
userRoutes.put("/:userId", userController.updateUser)

export default userRoutes;