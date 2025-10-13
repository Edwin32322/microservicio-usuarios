// controllers/userController.js
import { User } from "../models/userModel.js";

const handleError = (resp, error, status = 400) => {
    resp.status(status).json({
        status: 'failed',
        message: error.message
    });
};

export const userController = {
    async getAllUsers(req, resp, next) {
        try {
            const users = await User.getAllUsers();
            resp.status(200).json({ status: 'success', data: users });
        } catch (error) {
            handleError(resp, error, 500);
        }
    },

    async createUser(req, resp, next) {
        try {
            const userPayload = req.body;
            console.log(userPayload)
            const result = await User.createUser(userPayload);
            resp.status(201).json({ status: 'success', data: result.rows });
        } catch (error) {
            handleError(resp, error);
        }
    },

    async deleteUsers(req, resp, next) {
        try {
            const { usersIds } = req.body;
            const result = await User.deleteUsers(usersIds);
            resp.status(200).json({
                status: 'success',
                data: {
                    deleteCount: result.rowCount
                }
            });
        } catch (error) {
            handleError(resp, error);
        }
    },

    async updateUser(req, resp, next) {
        try {
            const { userId } = req.params;
            const userPayload = req.body;
            const result = await User.updateUser(userId, userPayload);
            resp.status(200).json({ status: 'success', data: result });
        } catch (error) {
            handleError(resp, error);
        }
    }
};