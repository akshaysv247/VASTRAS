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
    },
  ],
},{ timestamps: true }
);

const wishlistAdd = mongoose.model("wishlist", wishlist);

module.exports = wishlistAdd;
