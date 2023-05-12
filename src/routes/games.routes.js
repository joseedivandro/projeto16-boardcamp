import { Router } from "express";
import { getGames, createGames } from "../controllers/games.controller.js";


const gamesRouter = Router()

gamesRouter.get('/games', getGames)

gamesRouter.post('/games', createGames)


export default gamesRouter
