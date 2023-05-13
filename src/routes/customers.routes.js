import { Router } from "express";
import { createCustomers } from "../controllers/customers.controller.js";


const customersRouter = Router();

customersRouter.post("/customers", createCustomers);

export default customersRouter