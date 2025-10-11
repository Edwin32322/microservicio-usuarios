import { pool } from "../db/connection.js";

export class User {
    static async getAllUser() {
        const result = await pool.query("SELECT * FROM usuarios;")
        return result.rows;
    }
}