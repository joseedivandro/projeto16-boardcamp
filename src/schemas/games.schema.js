import joi from "joi"

export const GamesRules = joi.object({
    
    name: joi.string().empty().required(),
    image: joi.string().pattern(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/).required(),
    stockTotal: joi.number().integer().min(1).required(),
    pricePerDay: joi.number().integer().min(1).required(),
   

})