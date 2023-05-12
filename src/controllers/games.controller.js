import { db } from "../database/database.connection.js";
import { GamesRules } from "../schemas/games.schema.js";

export async function getGames(req, res) {
    try {
        const games = await db.query(`SELECT * FROM games;`)
        console.table(games.rows)
        res.send(games.rows)

    } catch (err) {
        res.status(500).send(err.message)

    }
}

export async function createGames(req, res) {
    try {
        const { name, image, stockTotal,  pricePerDay } = req.body;
        const { error } = GamesRules.validate({ name, image, stockTotal, pricePerDay });
        const gameExists = await db.query('SELECT * FROM games WHERE name = $1', [name]);
        console.log(error)
        if (error) {
            res.sendStatus(400);
        } else if (gameExists.rows.length) {
            res.sendStatus(409);
        } else {
            await db.query('INSERT INTO games (name, image, "stockTotal",  "pricePerDay") VALUES ($1, $2, $3, $4)', [name, image, stockTotal, pricePerDay]);
            res.sendStatus(201);
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
}

