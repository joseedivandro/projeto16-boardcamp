import { db } from "../database/database.connection.js";
import { GamesRules } from "../schemas/games.schema.js";

export async function getGames(req, res) {
    const nameSearch = req.query.name;

  if (nameSearch) {
    try {
      const result = await db.query(`
        SELECT * FROM games
        WHERE name iLIKE $1
        ;`, [nameSearch + "%"]);

      res.status(200).send(result.rows)
    } catch (err) {
      console.log(err.message);
      res.sendStatus(500);
    }
  } else {
    try {
      const result = await db.query(`
        SELECT * FROM games
        ;`);

      res.status(200).send(result.rows)
    } catch (err) {
      console.log(err.message);
      res.sendStatus(500);
    }
  }
}

export async function createGames(req, res) {
    try {
        const { name, image, stockTotal,  pricePerDay } = req.body;
        const { error } = GamesRules.validate({ name, image, stockTotal, pricePerDay });
        const gameExist = await db.query('SELECT * FROM games WHERE name = $1', [name]);
        console.log(error)
        if (error) {
            res.sendStatus(400);
        } else if (gameExist.rows.length) {
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

