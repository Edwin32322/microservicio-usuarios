import { User } from './userModel.js';
import { pool } from '../db/connection.js';
import { z } from 'zod';

jest.mock('../db/connection.js', () => ({
    pool: { query: jest.fn() }
}));

describe('User DAO', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('debe devolver todos los usuarios ordenados por id', async () => {
            const mockRows = [
                { id: 2, nombre: 'Ana' },
                { id: 1, nombre: 'Juan' }
            ];
            pool.query.mockResolvedValue({ rows: mockRows });

            const result = await User.getAllUsers();

            expect(pool.query).toHaveBeenCalledWith("SELECT * FROM usuarios;");
            expect(result).toEqual([
                { id: 1, nombre: 'Juan' },
                { id: 2, nombre: 'Ana' }
            ]);
        });

        it('debe lanzar error si pool.query falla', async () => {
            const error = new Error('Error DB');
            pool.query.mockRejectedValue(error);

            await expect(User.getAllUsers()).rejects.toThrow('Error DB');
        });
    });

    describe('createUser', () => {
        const validUser = { nombre: 'Pedro', correo: 'pedro@mail.com', edad: 25 };

        it('debe crear un usuario correctamente', async () => {
            pool.query
                .mockResolvedValueOnce({ rows: [] })
                .mockResolvedValueOnce({ rows: [], rowCount: 1 });

            const result = await User.createUser(validUser);

            expect(pool.query).toHaveBeenCalledTimes(2);
            expect(result.rowCount).toBe(1);
        });

        it('debe lanzar error si el nombre ya existe', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ nombre: 'Pedro', correo: 'otro@mail.com' }] });

            await expect(User.createUser(validUser)).rejects.toThrow('Ya existe un usuario con el nombre: Pedro');
        });

        it('debe lanzar error si el correo ya existe', async () => {
            pool.query.mockResolvedValueOnce({ rows: [{ nombre: 'Pedro2', correo: 'pedro@mail.com' }] });

            await expect(User.createUser(validUser)).rejects.toThrow('Ya existe un usuario con el correo: pedro@mail.com');
        });

    });

    describe('deleteUsers', () => {
        it('debe eliminar usuarios correctamente', async () => {
            pool.query.mockResolvedValue({ rowCount: 2 });

            const result = await User.deleteUsers([1, 2]);

            expect(pool.query).toHaveBeenCalledWith("DELETE FROM usuarios WHERE id = ANY($1)", [[1, 2]]);
            expect(result.rowCount).toBe(2);
        });
    });

    describe('updateUser', () => {
        const userPayload = { nombre: 'Juan', correo: 'juan@gmail.com', edad: 30 };

        it('debe actualizar un usuario correctamente', async () => {
            pool.query.mockResolvedValue({ rows: [userPayload] });

            const result = await User.updateUser(1, userPayload);

            expect(pool.query).toHaveBeenCalledWith(
                "UPDATE usuarios SET nombre = $1, correo = $2, edad = $3 WHERE id = $4",
                ['Juan', 'juan@gmail.com', 30, 1]
            );
            expect(result).toEqual([userPayload]);
        });

        it('debe lanzar error si no se pasa userId', async () => {
            await expect(User.updateUser(null, userPayload)).rejects.toThrow("El ID del usuario es requerido");
        });
    });

});
