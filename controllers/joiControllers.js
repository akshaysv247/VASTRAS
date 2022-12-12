const validation = require("../models/joiShcema");
const errorFunction = require("../utils/errorFunction");

const userValidation = async (req, next) => {
  try {
    const data = {
      Name: req.body.Name,
      Email: req.body.Email,
      Password: req.body.Password,
      PhoneNumber: req.body.PhoneNumber,

      is_active: req.body.is_active,
    };

    const { error, value } = validation.validate(data);

    if (error) {
      return;
      errorFunction(true, `Error in User Data : ${error.message}`);
    } else {
      return true;
    }
  } catch (err) {
    next(err);
  }
};

module.exports = userValidation;
