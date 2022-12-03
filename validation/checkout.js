const joi = require("joi");

const checkout = joi.object({
  userId: joi.string().required(),
  addressId: joi.string().required(),
  payment: joi.string().required(),
});

const userCheckOutData = async (req) => {
  console.log(req.body);
  const data = {
    userId: req.body.userId,
    addressId: req.body.addressId,
    payment: req.body.payment
  };

  const { error } = checkout.validate(data);

  if (error) {
    let msg = error.message;
    console.log(msg);
    return msg;
  } else {
    return true;
  }
};

module.exports = userCheckOutData;
