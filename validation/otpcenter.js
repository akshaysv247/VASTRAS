const joi = require("joi");

const otpEnter = joi.object({
  otp: joi.string().required(),
});

const otpEnterData = async (req) => {
  const data = {
    otp: req.body.otp,
   
  };

  const { error } = otpEnter.validate(data);

  if (error) {
    let msg = error.message;
    console.log(msg);
    return msg;
  } else {
    return true;
  }
};

module.exports = otpEnterData;
