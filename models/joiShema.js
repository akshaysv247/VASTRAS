const joi = require('joi');
const errorFunction = require("../utils/errorFunction");

const validation = joi.object({
     Name: joi.string().alphanum().min(3).max(25).trim(true).required(),
     Email: joi.string().email().trim(true).required(),
     Password: joi.string().min(8).trim(true).required(),
     PhoneNumber: joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required()

.default([]),
    is_active: joi.boolean().default(true),
});


module.exports = validation;
