const { boolean } = require("joi");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  images: [
    {
      type: String,
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "productCategory",
  },
  subcategory: {
    type: String,
  },
  size: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const productData = mongoose.model("productData", productSchema);

module.exports = productData;
