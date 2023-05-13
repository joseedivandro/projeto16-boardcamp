import joi from "joi"

export const  RentalRules = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().positive().integer().required(),
})