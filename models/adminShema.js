const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  Name: {
    type: String,
  },
  Email: {
    type: String,
  },
  Password: {
    type: String,
  },
});

const admindata = mongoose.model("admindata", adminSchema);

module.exports = admindata;
