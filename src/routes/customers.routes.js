import { Router } from "express";
import { createCustomers, getCustomers } from "../controllers/customers.controller.js";


const customersRouter = Router();

customersRouter.post("/customers", createCustomers);

customersRouter.get("/customers", getCustomers)

export default customersRouter