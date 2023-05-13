import { db } from "../database/database.connection.js";
import { CustomersRules } from "../schemas/customers.schema.js";


export async function createCustomers (req, res) {
    try {
        const { name, phone, cpf, birthday } = req.body;
        const { error } = CustomersRules.validate({ name, phone, cpf, birthday });
    
        const custumerExists = await db.query('SELECT * FROM customers WHERE cpf = $1;', [cpf])
    
        if (error) {
          res.sendStatus(400)
        }
        else if (custumerExists.rows.length > 0) {
          res.sendStatus(409)
        }
        else {
          await db.query('INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);', [name, phone, cpf, birthday]);
          res.sendStatus(201)
        }
      } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
      }
    }