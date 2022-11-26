const mongoose = require("mongoose");

const banner = new mongoose.Schema({
    name:{
        type:String
    },
  mainImage:[ {
    type: String,
  }],
});

const bannerMan = mongoose.model("banner", banner);

module.exports = bannerMan;
