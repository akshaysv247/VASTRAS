const mongoose = require("mongoose");

const couponSchema = mongoose.Schema({
  CODE: {
    type: String,
    required: true,
  },
  cutOff: {
    type: Number,
    required: true,
  },
  timeStamp: {
    type: Date,
    default: new Date(),
  },
  active: {
    type: Boolean,
    default: false,
  },
  couponType: {
    type: String,
    required: true,
  },
  maxRedeemAmount: {
    type: Number,
    required: true,
  },
  minCartAmount: {
    type: Number,
    required: true,
  },
  generateCount: {
    type: Number,
    required: true,
  },
  expireDate: {
    type: Date,
    require: true,
  },
});

const coupon = mongoose.model("coupon", couponSchema);

module.exports = coupon;
