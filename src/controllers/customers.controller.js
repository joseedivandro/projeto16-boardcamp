import { db } from "../database/database.connection.js";
import { CustomersRules } from "../schemas/customers.schema.js";


export async function createCustomers(req, res) {
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

export async function getCustomers(req, res) {
    const cpfSearch = req.query.cpf;

    if (cpfSearch) {
        try {
            const result = await db.query(`SELECT * FROM customers WHERE cpf iLIKE $1;`, [cpfSearch + "%"]);
            result.rows = result.rows.map(user => ({
                ...user,
                birthday: new Date(user.birthday).toISOString().split('T')[0] // Formata a data como YYYY-MM-DD
            }));
            res.status(200).send(result.rows);
        } catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
    } else {
        try {
            const result = await db.query(`SELECT * FROM customers;`);
            result.rows = result.rows.map(user => ({
                ...user,
                birthday: new Date(user.birthday).toISOString().split('T')[0] // Formata a data como YYYY-MM-DD
            }));
            res.status(200).send(result.rows);
        } catch (err) {
            console.log(err.message);
            res.sendStatus(500);
        }
    }
}



export async function getId(req, res) {
    try {
        const id = req.params.id;
        const result = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.sendStatus(404);
        } else {
            result.rows = result.rows.map(e => ({
                ...e,
                birthday: new Date(e.birthday).toISOString().split('T')[0] // Formata a data como YYYY-MM-DD
            }));
            res.status(200).send(result.rows[0]);
        }
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
}


export async function putId (req, res) {
    try {
        const id = req.params.id
        const { name, phone, cpf, birthday } = req.body;
        const { error } = CustomersRules.validate({ name, phone, cpf, birthday });
        const custumerExists = await db.query('SELECT * FROM customers WHERE cpf = $1 AND id <> $2;', [cpf, id])
    
        if (error) {
          res.sendStatus(400)
        }
        else if (custumerExists.rows.length > 0) {
          res.sendStatus(409)
        }
        else {
          await db.query('UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5;', [name, phone, cpf, birthday, id]);
          res.sendStatus(200)
        }
      } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
      }

}