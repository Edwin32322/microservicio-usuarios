import Express from "express";
import { configDotenv } from "dotenv";

configDotenv()

const app = Express();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Microservicio corriendo en: http://localhost:${PORT}`);
})
