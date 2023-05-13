import joi from "joi"

export const CustomersRules = joi.object({
    id: joi.any().forbidden(),
    name: joi.string().empty().required(),
    phone: joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
    cpf: joi.string().length(11).empty().pattern(/^[0-9]+$/).required(),
    birthday: joi.date().iso().required(),
    
  });
  
