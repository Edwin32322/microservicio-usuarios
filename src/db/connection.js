import { Pool } from "pg";
import { configDotenv } from "dotenv";

configDotenv();

export const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.HOST,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: process.env.DB_PORT
});
