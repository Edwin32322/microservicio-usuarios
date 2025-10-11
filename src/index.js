import Express from "express";
import { configDotenv } from "dotenv";
import userRoutes from "./routes/userRoutes.js";

configDotenv();

const app = Express();

app.use('/api/data', userRoutes);

app.use(Express.json());

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Microservicio corriendo en: http://localhost:${PORT}`);
})
