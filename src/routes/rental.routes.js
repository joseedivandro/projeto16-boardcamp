import { Router } from "express";
import { createRental } from "../controllers/rental.controller.js";

const rentalRouter = Router()


rentalRouter.post('/rentals', createRental)


export default rentalRouter