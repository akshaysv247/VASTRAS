const cartDB = require("../models/cartShcema");
const addressDB = require("../models/adressScema");
const orderDB = require("../models/orderSchema");
const moment = require("moment");
const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: "rzp_test_gVjE7EEMOSkshL",
  key_secret: "kTKQzkNSx1rrsehhJgW9511O",
});

module.exports = {
  checkOutPage: async (req, res) => {
    const user = req.session.user;
    const userId = user._id;
    // const product = await cartDB.findOne({ userId: userId })
    const product = await cartDB
      .findOne({ userId: userId })
      .populate("products.productId");

    let address = null;
    const productData = product.products;
    console.log(product);
    //console.log(productData);

    const addressData = await addressDB.findOne({ userId: userId });
    if (addressData) {
      address = addressData.address;
    }
    //console.log(address);

    res.render("user/checkoutbox", { product, productData, address });
  },

  orderConform: async (req, res) => {
    console.log(req.body);

    const user = await req.session.user;
    const userId = await user._id;
    const cartData = await cartDB.findOne({ userId: userId });
    //console.log(cartData);
    const price = cartData.grandtotal;
    const products = cartData.products;
    //console.log(products);
    const ID = products.productId;
    let status = req.body.payment == "COD" ? "placed" : "pending";
    // console.log(ID);

    Object.assign(
      req.body,
      { userId: userId },
      { price: price },
      { products: products },
      { date: moment().format("MMMM Do YYYY, h:mm:ss a") },
      { status: status }
    );
    const order = await orderDB.create(req.body);
    console.log(order.id);
    const remove = await cartDB.findOneAndRemove({ userId: userId });

    if (req.body["payment"] == "COD") {
      res.json({ cod: true });
    } else {
      const onlinePay = await instance.orders.create({
        amount: price,
        currency: "INR",
        receipt: "" + order._id,
        notes: {
          key1: "value3",
          key2: "value2",
        },
      });
      res.json({ onlinePay });
      console.log(onlinePay);
    }

    //res.render("user/thankyou");
  },

  viewOreders: (req, res) => {
    res.render("user/vieworders");
  },
  verifyPayment: (req, res) => {
    console.log(req.body);
  },

  thankYou: (req, res) => {
    res.render("user/thankyou");
  },
};
