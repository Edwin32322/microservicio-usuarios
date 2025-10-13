import Express from "express";
import { configDotenv } from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

configDotenv();

const app = Express();

app.use(cors({
    origin: process.env.ORIGIN_FRONTEND,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(Express.json());

app.use('/api/data', userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Microservicio corriendo en: http://localhost:${PORT}`);
})
