import request from 'supertest';
import express from 'express';
import { userController } from '../controllers/userController.js';
import { User } from '../models/userModel.js';

jest.mock('../models/userModel.js');

const app = express();
app.use(express.json());
app.get('/users', userController.getAllUsers);
app.post('/users', userController.createUser);
app.delete('/users', userController.deleteUsers);
app.put('/users/:userId', userController.updateUser);

describe('User Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /users', () => {
        it('Debería obtener los usuarios correctamente', async () => {
            const mockUsers = [
                { id: 1, name: 'Miguel' },
                { id: 2, name: 'Marcos' }
            ];

            User.getAllUsers.mockResolvedValue(mockUsers);

            const response = await request(app)
                .get('/users')
                .expect(200);

            expect(response.body).toEqual({
                status: 'success',
                data: mockUsers
            });
            expect(User.getAllUsers).toHaveBeenCalledTimes(1);
        });

        it('Debería lanzar un error al obtener los usuarios', async () => {
            const mockError = new Error('Error en la base de datos');
            User.getAllUsers.mockRejectedValue(mockError);

            const response = await request(app)
                .get('/users')
                .expect(500);

            expect(response.body).toEqual({
                status: 'failed',
                message: 'Error en la base de datos'
            });
        });
    });

    describe('POST /users', () => {
        it('Debería crear el usuario correctamente', async () => {
            const mockUserPayload = { name: 'Edwin', email: 'edwincastellanos150@gmail.com' };
            const mockResult = { rows: [{ id: 1, ...mockUserPayload }] };

            User.createUser.mockResolvedValue(mockResult);

            const response = await request(app)
                .post('/users')
                .send({ userPayload: mockUserPayload })
                .expect(201);

            expect(response.body).toEqual({
                status: 'success',
                data: mockResult.rows
            });
            expect(User.createUser).toHaveBeenCalledWith(mockUserPayload);
        });

        it('Debería manejar la validacion cuando el user payload no es valido', async () => {
            const mockError = new Error('Correo no es valido');
            User.createUser.mockRejectedValue(mockError);

            const response = await request(app)
                .post('/users')
                .send({ userPayload: { name: 'Majin Buu' } })
                .expect(400);

            expect(response.body).toEqual({
                status: 'failed',
                message: 'Correo no es valido'
            });
        });
    });

    describe('DELETE /users', () => {
        it('debería eliminar correctamente los usuarios', async () => {
            const usersIds = [1, 2, 3];
            const mockResult = { rowCount: 3 };

            User.deleteUsers.mockResolvedValue(mockResult);

            const response = await request(app)
                .delete('/users')
                .send({ usersIds })
                .expect(200);

            expect(response.body).toEqual({
                status: 'success',
                data: {
                    deleteCount: 3
                }
            });
            expect(User.deleteUsers).toHaveBeenCalledWith(usersIds);
        });
    });

    describe('PUT /users/:userId', () => {
        it('debería realizar un actualización correcta', async () => {
            const userId = '123';
            const userPayload = { name: 'Updated Name' };
            const mockResult = { id: userId, ...userPayload };

            User.updateUser.mockResolvedValue(mockResult);

            const response = await request(app)
                .put(`/users/${userId}`)
                .send({ userPayload })
                .expect(200);

            expect(response.body).toEqual({
                status: 'success',
                data: mockResult
            });
            expect(User.updateUser).toHaveBeenCalledWith(userId, userPayload);
        });

        it('Debería manejar el error cuando no encuentra un usuario para actualizar', async () => {
            const mockError = new Error('Usuario no existe');
            User.updateUser.mockRejectedValue(mockError);

            const response = await request(app)
                .put('/users/999')
                .send({ userPayload: { name: 'Test' } })
                .expect(400);

            expect(response.body).toEqual({
                status: 'failed',
                message: 'Usuario no existe'
            });
        });
    });
});