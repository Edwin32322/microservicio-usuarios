import { User } from "../models/userModel.js";

export const userController = {
    async getAllUser(req, resp, next) {
        try {
            const data = await User.getAllUser();
            resp.status(200).json(data);
        } catch (error) {
            next(error);
        }
    },
}