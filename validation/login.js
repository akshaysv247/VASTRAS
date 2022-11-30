const joi = require("joi");

const login = joi.object({
  Email: joi.string().email().required(),
  Password: joi.string().min(8).required(),
});

const userLoginData = async (req) => {
  console.log(req.body);
  const data = {
    Email: req.body.Email,
    Password: req.body.Password,
  };

  const { error } = login.validate(data);

  if (error) {
    let msg = error.message;
    console.log(msg);
    return msg;
  } else {
    return true;
  }
};

module.exports = userLoginData;
