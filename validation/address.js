const joi = require("joi");

const address = joi.object({
   
    name: joi.string().required(),
    phoneNumber: joi.string().required(),
    pincode: joi.string().required(),
    locality: joi.string().required(),
    adress: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
});

const userCheckAddress = async (req) => {
  const data = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    pincode: req.body.pincode,
    locality: req.body.locality,
    adress: req.body.adress,
    city: req.body.city,
    state: req.body.state,
  };

  const { error } = address.validate(data);

  if (error) {
    let msg = error.message;
    console.log(msg);
    return msg;
  } else {
    return true;
  }
};

module.exports = userCheckAddress;
