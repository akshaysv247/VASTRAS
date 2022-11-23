const mongoose = require("mongoose");

const subCategory = new mongoose.Schema({
  title: {
    type: String,
  },
});

const subCategorys = mongoose.model("productSubCategory", subCategory);

module.exports = subCategorys;
