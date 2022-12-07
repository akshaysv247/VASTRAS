const cartDB = require("../models/cartShcema");
const addressDB = require("../models/adressScema");
const orderDB = require("../models/orderSchema");
const moment = require("moment");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const userDB = require("../models/userSchema");
const checkOutValidation = require("../validation/checkout");
const couponDB = require("../models/coupon");
const userHelper = require("../helpers/userHelper");
const productDB = require("../models/productSchema")

const instance = new Razorpay({
  key_id: "rzp_test_gVjE7EEMOSkshL",
  key_secret: "kTKQzkNSx1rrsehhJgW9511O",
});

module.exports = {
  checkOutPage: async (req, res) => {
    const user = req.session.user;
    const userId = user._id;
    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      cartCount = await userHelper.getCartCount(user._id);
      res.locals.cartCount = cartCount;
      wishlistCount = await userHelper.getWishListCount(user._id);
      res.locals.wishlistCount = wishlistCount;
    }
    // const product = await cartDB.findOne({ userId: userId })
    const product = await cartDB
      .findOne({ userId: userId })
      .populate("products.productId");

    let address = null;
    let coupon = null;
    const productData = product.products;
    // console.log(product);
    //console.log(productData);
    coupon = await couponDB.find({ active: true });
    console.log(coupon);
    const addressData = await addressDB.findOne({ userId: userId });
    if (addressData) {
      address = addressData.address;
    }
    //console.log(address);

    res.render("user/checkoutbox", {
      product,
      productData,
      address,
      error: req.flash("userErr"),
      addressData,
      coupon,
      cartCount,
      wishlistCount,
      user,
    });
  },

  orderConform: async (req, res) => {
    console.log(req.body);
    let validate = await checkOutValidation(req);
    if (validate == true) {
      const user = await req.session.user;
      const userId = await user._id;
      const cartData = await cartDB.findOne({ userId: userId });
     // console.log(cartData);
      const price = cartData.grandtotal;
      const discountPrice = req.body.grandtotal;

      let discount = 0;
      if (discountPrice) {
        discount = price - discountPrice;
      }
      const priceTotal = price - discount;
      const products = await cartData.products;
      //console.log(products);
      const ID = products.productId;
      let status = req.body.payment == "COD" ? "placed" : "pending";
      // console.log(ID);

      Object.assign(
        req.body,
        { userId: userId },
        { productPrice: price },
        { price: priceTotal },
        { discount: discount },
        { products: products },
        { date: moment().format("MMMM Do YYYY") },
        { status: status }
      );
      const order = await orderDB.create(req.body);
      const newOrderId = order._id;
      //console.log(order.id);
      //console.log(newOrderId);

      if (req.body["payment"] == "COD") {
        const order = await orderDB.findOne({ _id: newOrderId });
       const findProductId = order.products
       //console.log(findProductId);
       findProductId.forEach(async(el) => {
       let removeQuantity = await productDB.findOneAndUpdate({_id:el.productId},{$inc:{quantity:-el.quantity}})
       });
        const code = order.couponname;
        if (code) {
          const couponDecrese = await couponDB.findOneAndUpdate(
            { CODE: code },
            { $inc: { generateCount: -1 } }
          );
        }
        const remove = await cartDB.findOneAndRemove({ userId: userId });
        res.json({ cod: true, newOrderId });
      } else {
        const onlinePay = await instance.orders.create({
          amount: priceTotal * 100,
          currency: "INR",
          receipt: "" + order._id,
          notes: {
            key1: "value3",
            key2: "value2",
          },
        });
        // console.log(onlinePay);
        res.json({ onlinePay });
      }
    } else {
      let err = validate;
      console.log(err);
      req.flash("userErr", "Incorrect email ! ");
      res.redirect("/checkout");
    }
  },

  viewOreders: async (req, res) => {
    //console.log(req.params.id);

    const orderId = req.params.id;

    const order = await orderDB.findOne({ _id: orderId });
    //console.log(order);
    const user = order.userId;
    const userData = await userDB.findOne({ _id: user });
    // console.log(userData);
    const addressId = order.addressId;
    let product = null;
    let adressData = null;
    //console.log(addressId);
    if (order) {
      const data = await orderDB
        .findOne({ _id: orderId })
        .populate("products.productId");
      product = data.products;
      // console.log(product);
      const address = await addressDB.findOne({ userId: user });
      //console.log(address);
      adressData = await address.address.find(
        (el) => el._id.toString() == addressId
      );
      //console.log(adressData);
    }

    res.render("user/vieworders", { userData, product, order, adressData });
  },
  verifyPayment: async (req, res) => {
    const user = await req.session.user;
    const userId = await user._id;
    //console.log(req.body);
    const orderId = req.body.payment["razorpay_order_id"];
    const paymentId = req.body.payment["razorpay_payment_id"];
    const sign = req.body.payment["razorpay_signature"];
    const cartId = req.body.order["receipt"];

    let hmac = crypto.createHmac("sha256", "kTKQzkNSx1rrsehhJgW9511O");
    hmac.update(orderId + "|" + paymentId);
    hmac = hmac.digest("hex");
    if (hmac == sign) {
      const update = await orderDB.findOneAndUpdate(
        { _id: cartId },
        {
          $set: {
            status: "placed",
          },
        }
      );
      const order = await orderDB.findOne({ _id: cartId });
      const findProductId = order.products
      //console.log(findProductId);
      findProductId.forEach(async(el) => {
      let removeQuantity = await productDB.findOneAndUpdate({_id:el.productId},{$inc:{quantity:-el.quantity}})
      });
      const code = order.couponname;
      if (code) {
        const couponDecrese = await couponDB.findOneAndUpdate(
          { CODE: code },
          { $inc: { generateCount: -1 } }
        );
      }

      const remove = await cartDB.findOneAndRemove({ userId: userId });

      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  },

  thankYou: async (req, res) => {
    const orderId = req.params.id;
    const user = req.session.user;
    const userId = user._id;
    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      cartCount = await userHelper.getCartCount(user._id);
      res.locals.cartCount = cartCount;
      wishlistCount = await userHelper.getWishListCount(user._id);
      res.locals.wishlistCount = wishlistCount;
    }
    const order = await orderDB.findOne({ _id: orderId });
    res.render("user/thankyou", { order, user, cartCount, wishlistCount });
  },

  applyCoupon: async (req, res) => {
    // console.log(req.body);
    const code = req.body.code;
    const price = parseInt(req.body.total);
    // console.log(price);
    const data = await couponDB.findOne({ CODE: code });
    // console.log(data);
    let nowDate = moment().format("MM/DD/YYYY");
    console.log(nowDate);
    if (data) {
      const type = data.couponType;
      const min = data.minCartAmount;
      const max = data.maxRedeemAmount;
      const date = data.expireDate.toLocaleDateString();
      const couponCount = data.generateCount;
      // console.log(type);
      if (couponCount > 0) {
        if (nowDate < date) {
          if (min < price) {
            if (type === "cash") {
              const dataCash = data.cutOff;
              // console.log(dataCash);
              const total = price - dataCash;
              // console.log(total);
              res.json({ total });
            } else {
              const dataPer = data.cutOff;
              let perOne = price / 100;
              let newPer = perOne * dataPer;
              let newTotal = null;
              if (max < newPer) {
                newTotal = price - max;
              } else {
                newTotal = price - newPer;
              }
              res.json({ newTotal });
            }
          } else {
            res.json({ price });
          }
        } else {
          res.json({ date });
        }
      } else {
        res.json({ status: false });
      }
      res.json({ count });
    }
  },

  orderCancel: async (req, res) => {
    const orderId = req.params.id;
    const find = await orderDB.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: "canceled" } }
    );
    console.log(find);
    res.json({ status: true });
  },

  orderListUserSide: async (req, res) => {
    const user = req.session.user;
    const userId = user._id;
    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      cartCount = await userHelper.getCartCount(user._id);
      res.locals.cartCount = cartCount;
      wishlistCount = await userHelper.getWishListCount(user._id);
      res.locals.wishlistCount = wishlistCount;
    }
    let data = null;
    data = await orderDB.find({ userId: userId });
    res.render("user/orderslist", { data, wishlistCount, cartCount, user });
  },
};
