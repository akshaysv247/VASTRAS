const joi = require("joi");

const editUser = joi.object({
 
    Name: joi.string().min(3).max(25).required(),
    Email: joi.string().email().required(),
  PhoneNumber: joi
  .string()
  .length(10)
  .required()

  

});

const userNeData = async (req) => {
  console.log(req.body);
  const data = {
    Name: req.body.Name,
    Email: req.body.Email,
    PhoneNumber: req.body.PhoneNumber
  };
    console.log(data);
  const { error } = editUser.validate(data)

  if (error) {
    let msg = error.message;
    console.log(msg);
    return msg;
  } else {
    return true;
  }
};

module.exports = userNeData;
