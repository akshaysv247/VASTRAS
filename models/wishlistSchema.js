const mongoose = require("mongoose");

const wishlist = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userData",
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productData",
      },
      //quantity: { type: Number },
      //total: { type: Number },
      // price:{type:Number},
    },
  ],
  
});

const wishlistAdd = mongoose.model("wishlist", wishlist);

module.exports = wishlistAdd;
