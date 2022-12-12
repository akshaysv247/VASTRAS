const joi = require("joi");

const addProduct = joi.object({
  title: joi.string().required(),
  price: joi.string().required(),
  quantity: joi.string().required(),
  description: joi.string().required(),
  category: joi.string().required(),
  size:joi.string().required(),
});

const addProductData = async (req) => {
  //console.log(req.body);
  const data = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    quantity:req.body.quantity,
    category:req.body.category,
    size:req.body.size,
  };

  const { error } = addProduct.validate(data);

  if (error) {
    let msg = error.message;
    console.log(msg);
    return msg;
  } else {
    return true;
  }
};

module.exports = addProductData;
