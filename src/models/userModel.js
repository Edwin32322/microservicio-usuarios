import { pool } from "../db/connection.js";
import { z } from "zod";

const UserSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    correo: z.email("El correo no es válido"),
    edad: z.number().int().min(18, "La edad debe ser al menos 18").max(120, "La edad no puede ser mayor a 120")
});

export class User {
    static async getAllUsers() {
        const result = await pool.query("SELECT * FROM usuarios;");
        return result.rows.sort((a, b) => a.id - b.id);
    }

    static async createUser(userPayload) {
        UserSchema.parse(userPayload);

        const existResult = await pool.query(
            "SELECT nombre, correo FROM usuarios WHERE nombre = $1 OR correo = $2",
            [userPayload.nombre, userPayload.correo]
        );

        if (existResult.rows.length > 0) {
            const usuarioExistente = existResult.rows[0];
            if (usuarioExistente.nombre === userPayload.nombre) {
                throw new Error(`Ya existe un usuario con el nombre: ${userPayload.nombre}`);
            }
            if (usuarioExistente.correo === userPayload.correo) {
                throw new Error(`Ya existe un usuario con el correo: ${userPayload.correo}`);
            }
        }

        const result = await pool.query(
            "INSERT INTO usuarios (nombre, correo, edad) VALUES($1, $2, $3)",
            [userPayload.nombre, userPayload.correo, userPayload.edad]
        );

        return result;
    }

    static async deleteUsers(usersIds) {
        if (!Array.isArray(usersIds) || usersIds.length === 0) {
            throw new Error("usersIds debe ser un array no vacío");
        }

        const result = await pool.query("DELETE FROM usuarios WHERE id = ANY($1)", [usersIds]);
        return result;
    }

    static async updateUser(userId, userPayload) {
        if (!userId) throw new Error("El ID del usuario es requerido");

        UserSchema.parse(userPayload);

        const { nombre, correo, edad } = userPayload;

        const result = await pool.query(
            "UPDATE usuarios SET nombre = $1, correo = $2, edad = $3 WHERE id = $4",
            [nombre, correo, edad, userId]
        );

        return result.rows;
    }
}
