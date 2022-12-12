const { string } = require("joi");
const mongoose = require("mongoose");

const productCategory = new mongoose.Schema({
  name: {
    type: String,
  },
  id: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  discription: {
    type: String,
  },
},{ timestamps: true }
);

const category = mongoose.model("productCategory", productCategory);

module.exports = category;
