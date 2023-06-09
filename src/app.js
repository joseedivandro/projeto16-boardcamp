import express from "express"
import cors from "cors"
import gamesRouter from "./routes/games.routes.js";
import customersRouter from "./routes/customers.routes.js";
import rentalRouter from "./routes/rental.routes.js";


const app = express()
app.use(cors());
app.use(express.json());
app.use(gamesRouter);
app.use(customersRouter);
app.use(rentalRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))
