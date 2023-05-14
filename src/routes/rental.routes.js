import { Router } from "express";
import { createRental, deleteRental, returnRental, getRental} from "../controllers/rental.controller.js";

const rentalRouter = Router()


rentalRouter.post('/rentals', createRental)

rentalRouter.delete('/rentals/:id', deleteRental)

rentalRouter.post('/rentals/:id/return',returnRental)

rentalRouter.get('/rentals', getRental)


export default rentalRouter

