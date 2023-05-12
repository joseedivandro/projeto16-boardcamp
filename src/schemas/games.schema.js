import joi from "joi"

export const GamesRules = joi.object({

    name: joi.string().empty().required(),
    image: Joi.string().trim().uri().required(),
    stockTotal: joi.number().integer().min(1).required(),
    pricePerDay: joi.number().integer().min(1).required(),
   

})