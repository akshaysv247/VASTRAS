const cartDB = require("../models/cartShcema");
const addressDB = require("../models/adressScema");
const orderDB = require("../models/orderSchema");

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
    // console.log(product);
    //console.log(productData);

    const addressData = await addressDB.findOne({ userId: userId });
    address = addressData.address;
    //console.log(address);

    res.render("user/checkoutbox", { product, productData, address });
  },

  orderConform: async (req, res) => {
    console.log(req.body);
    const cartId = await req.params.id;
    console.log(cartId);
    const user = await req.session.user;
    const userId = await user._id;
    const cartData = await cartDB.findOne({ cartId: cartId });
    console.log(cartData);
    const price = cartData.grandtotal;
    const products = cartData.products;
    console.log(products);
    const ID = products.productId;
    console.log(ID);

    Object.assign(
      req.body,
      { userId: userId },
      { cartId: cartId },
      { price: price },
      { products: products }
    );
    const order = await orderDB.create(req.body);
    const remove = await cartDB.findOneAndRemove({ cartId: cartId });

    res.render("user/thankyou");
  },
};
