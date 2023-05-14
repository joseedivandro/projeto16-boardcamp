import { db } from "../database/database.connection.js";
import { RentalRules } from "../schemas/rental.shema.js";
import { differenceInDays } from 'date-fns';
import dayjs from "dayjs";




export async function getRental(req, res){
  try{
    const rental = await db.query(`SELECT
       rentals.*,
       customers.id AS "customers.id",
       customers.name AS "customerName",
       games.id AS "gameId",
       games.name AS "gameName"
       FROM customers
       
    JOIN rentals ON customers.id = rentals."customerId"
    JOIN games ON games.id = rentals."gameId";
    
    `)
    const rentals = rental?.rows.map((rentalMap)=>{
      const {id, customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee, gameName, customerName} = rentalMap

      return {
        id, customerId, gameId, rentDate: dayjs(rentDate).format('YYYY-MM-DD'),
        daysRented, returnDate: returnDate ? dayjs(returnDate).format('YYYY-MM-DD'): null, 
        originalPrice, delayFee, 
        customerId: { id: customerId, name: customerName},
        game: {id: gameId, name: gameName}
      }

    })
    res.send(rentals)

  }catch(err){
    res.status(500).send(err.message)
  }
}


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



export async function returnRental(req, res) {
  try {
    const id = req.params.id;

    const result = await db.query(`
      SELECT 
        rentals.*,
        games."pricePerDay"
      FROM rentals
        JOIN games
          ON rentals."gameId" = games.id 
      WHERE rentals.id = $1`, [id]);

    const rentExists = result.rows[0];

    if (!rentExists) {
      res.sendStatus(404);
      return;
    }
    if (rentExists.returnDate !== null) {
      res.sendStatus(400);
      return;
    }

    const rentDate = new Date(rentExists.rentDate);
    const returnDate = new Date();
    const pricePerDayOfThisGame = rentExists.pricePerDay;
    const rentedDaysOfThisGame = rentExists.daysRented;
    let delayFee = null;

    if (returnDate.getTime() > rentDate.getTime()) {
      const delayDays = differenceInDays(returnDate, rentDate);

      if (delayDays > rentedDaysOfThisGame) {
        const extraDays = delayDays - rentedDaysOfThisGame;
        delayFee = extraDays * pricePerDayOfThisGame;
      }
    }

    await db.query('UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;', [returnDate, delayFee, id]);
    res.sendStatus(200);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
}


export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    // Verificar se o aluguel existe
    const rental = await db.query('SELECT * FROM rentals WHERE id = $1', [id]);
    if (rental.rows.length === 0) {
      // Retornar código 404 se o aluguel não existe
      return res.sendStatus(404);
    }

    // Verificar se o aluguel foi finalizado
    if (rental.rows[0].finished === false) {
      // Retornar status 400 se o aluguel não foi finalizado
      return res.sendStatus(400);
    }

    // Deletar o aluguel
    await db.query('DELETE FROM rentals WHERE id = $1', [id]);

    // Retornar código 200 em caso de sucesso
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
}

