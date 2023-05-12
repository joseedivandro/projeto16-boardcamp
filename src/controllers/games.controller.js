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
        const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
        const { error } = GamesRules.validate({ name, image, stockTotal, categoryId, pricePerDay });
        const categoryExists = await connection.query('SELECT * FROM categories WHERE id = $1', [categoryId]);
        const gameExists = await connection.query('SELECT * FROM games WHERE name = $1', [name]);
        console.log(error)
        if (!categoryExists.rows.length || error) {
            res.sendStatus(400);
        }
        else if (gameExists.rows.length) {
            res.sendStatus(409);
        }
        else {
            await connection.query('INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)', [name, image, stockTotal, categoryId, pricePerDay])
            res.sendStatus(201);
        }
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }

}