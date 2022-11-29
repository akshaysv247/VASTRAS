const mongoose = require("mongoose");

const order = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userData",
  },
  cartId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "addCart",
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productData",
      },
      quantity: { type: Number },
      total: { type: Number },
      
    },
  ],
  addressId:{
     type: mongoose.Schema.Types.ObjectId,
        ref: "userAdress",
 },
 price:{
    type:Number
 },
 payment:{
    type:String
 }
});

const addOrder = mongoose.model("orders", order);

module.exports = addOrder;
