import { db } from "../database/database.connection.js";
import { RentalRules } from "../schemas/rental.shema.js";


export async function createRental (req, res) {
    try {
        const { customerId, gameId, daysRented } = req.body;
        const { error } = RentalRules.validate({ customerId, gameId, daysRented });
    
        const gameExists = await db.query(`SELECT * FROM games WHERE id = $1`, [gameId]);
        const customerExists = await db.query(`SELECT * FROM customers WHERE id = $1`, [customerId]);
        const gamesRented = await db.query(`
          SELECT 
            rentals.*,
            games."stockTotal"
          FROM rentals
            JOIN games
            ON rentals."gameId" = games.id
          WHERE "gameId" = $1 AND rentals."returnDate" IS null;
        `, [gameId]);
    
        const qtyRentalsOfThisGame = gamesRented.rows.length;
        const totalStockOfThisGame = gameExists.rows[0].stockTotal;
        const pricePerDayOfThisGame = gameExists.rows[0].pricePerDay;
    
        if (error || gameExists.rows.length === 0 || customerExists.rows.length === 0 || (qtyRentalsOfThisGame === totalStockOfThisGame)) {
          res.sendStatus(400);
        } else {
          const rentDate = new Date();
          const returnDate = null;
          const originalPrice = (daysRented * pricePerDayOfThisGame);
          const delayFee = null;
    
          await db.query(`
            INSERT INTO 
              rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
            VALUES ($1, $2, $3, $4, $5, $6, $7);`, [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);
    
          res.sendStatus(201);
        }
      } catch (err) {
        console.log(err.menssage);
        res.sendStatus(500);
      }

}