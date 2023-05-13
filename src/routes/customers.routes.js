import { Router } from "express";
import { createCustomers, getCustomers, getId, putId} from "../controllers/customers.controller.js";


const customersRouter = Router();

customersRouter.post("/customers", createCustomers);

customersRouter.get("/customers", getCustomers);

customersRouter.get("/customers/:id", getId);

customersRouter.put("/customers/:id", putId)

export default customersRouter