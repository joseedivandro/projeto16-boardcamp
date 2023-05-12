import { Router } from "express";
import { getGames, createGames } from "../controllers/games.controller.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";

const gamesRouter = Router()

gamesRouter.get('/games', getGames)

gamesRouter.post('post', createGames)


export default gamesRouter
