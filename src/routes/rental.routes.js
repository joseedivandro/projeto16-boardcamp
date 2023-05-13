import { Router } from "express";
import { createRental, deleteRental, returnRental} from "../controllers/rental.controller.js";

const rentalRouter = Router()


rentalRouter.post('/rentals', createRental)

rentalRouter.delete('/rentals/:id', deleteRental)

rentalRouter.post('/rentals:id/return',returnRental)


export default rentalRouter

