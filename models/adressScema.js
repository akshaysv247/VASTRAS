const { number } = require("joi");
const mongoose = require("mongoose");

const adress = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userData",
  },
  address:[{
    name: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    pincode: {
      type: Number,
    },
    locality: {
      type: String,
    },
    adress: {
      type: String,
    },
    city: {
      type: String,
    },
    landmark: {
      type: String,
    },
    AlternatePhone: {
      type: Number,
    },
    state: {
      type: String,
    },
}]
});

const addAdress = mongoose.model("userAdress", adress);

module.exports = addAdress;
