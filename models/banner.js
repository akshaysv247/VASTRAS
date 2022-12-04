const mongoose = require("mongoose");

const banner = new mongoose.Schema({
    title:{
        type:String
    },
  images:[ {
    type: String,
  }],
});

const bannerMan = mongoose.model("banner", banner);

module.exports = bannerMan;
