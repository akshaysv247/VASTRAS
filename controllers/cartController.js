const productDB = require("../models/productSchema");
const userDB = require("../models/userSchema");
const cartDB = require("../models/cartShcema");
const userHelper = require("../helpers/userHelper");

module.exports = {
  cartView: async (req, res) => {
    const user = await req.session.user;
    let cartCount = null;
    if (user) {
      // console.log(user);
      cartCount = await userHelper.getCartCount(user._id);
      res.locals.cartCount = cartCount;
    }
    const userId = await user._id;
    const datas = await cartDB
      .findOne({ userId: userId })
      .populate("products.productId");
    console.log(datas);
    const product = datas.products;

    //console.log(product);
    //console.log(products[0].productId.title);

    res.render("user/cart", { product, user, datas, cartCount });
  },

  addCart: async (req, res) => {
    // const user =  req.session.user
    // console.log(user);
    //console.log(req.body);
    try {
      let quantity = 1;
      const productId = await req.params.id;
      const user = await req.session.user;
      const userId = await user._id;
      const product = await productDB.findById(productId);
      //    const name = await product.title
      //    const price = await product.price
      //console.log(product);
      const userCart = await cartDB.findOne({ userId: userId });
      //console.log(userCart);
      const price = product.price;
      const total = price * quantity;

      let grandtotal = product.price;
      // console.log(total);
      const proD = await {
        productId: productId,
        quantity: quantity,
        total: total,
      };
      const products = [];
      products.push(proD);

      Object.assign(
        req.body,
        { userId: userId },
        { products: products },
        { grandtotal: grandtotal }
      );
      //console.log(req.body);
      const cartData = await req.body;
      // console.log(cartData);
      if (userCart) {
        const proExist = await userCart.products.findIndex(
          (product) => product.productId == productId
        );
        //console.log(proExist);
        if (proExist != -1) {
          // const grand = await cartDB.findOneAndUpdate({userId:userId},{$inc:{grandtotal:grandtotal}},{ upsert: true })
          // console.log(grand);

          const add = await cartDB.findOneAndUpdate(
            { "products.productId": productId },
            {
              $inc: { "products.$.quantity": 1, grandtotal: price },
            },
            { upsert: true }
          );
          res.json({ status: true });
        } else {
          const cart = await cartDB.findOneAndUpdate(
            { userId: userId },
            { $push: { products: proD } },
            { upsert: true }
          );
          const cartA = await cartDB.findOneAndUpdate(
            { userId: userId },
            { $inc: { grandtotal: price } },
            { upsert: true }
          );
          // console.log(cart);
          //res.redirect('/cart')
          res.json({ status: true });
        }
      } else {
        const cart = await cartDB.create(cartData);
        // res.redirect('/cart')
        res.json({ status: true });
      }
    } catch {}
  },

  deleteProduct: async (req, res) => {
    //console.log(req.body);
    console.log(req.params.id);
    const user = await req.session.user;
    const userId = await user._id;
    const proId = await req.params.id;
    //  const product = await cartDB.findOne({ userId: userId },{ products: {productId:proId}});
    //   const price = await cartDB.find({ userId: userId },{ products: {productId:proId}},"products.$.productId.total")
    //   console.log(product);
    //   console.log(price);

    const proDelete = await cartDB.findOneAndUpdate(
      { userId: userId },
      { $pull: { products: { productId: proId } } }
    );
    //   const priceIncrese = await cartDB.findOneAndUpdate({userId:userId},{$inc:{grandtotal:-price}})

    res.redirect("/cart");
  },

  changeProductQuantity: async (req, res) => {
    // console.log(req.body);
    try {
      let total = parseInt(req.body.total);
      let price = parseInt(req.body.price);
      let quantity = parseInt(req.body.quantity);
      const product = req.body.product;
      const userId = req.body.user;
      let count = parseInt(req.body.count);
      total = count * price;
      // console.log(total);
      const find = await cartDB.findOne({ userId: userId });
      let grandtotal = find.grandtotal;

      if (find) {
        if (count == -1 && quantity == 1) {
          const remove = await cartDB.findOneAndUpdate(
            { "products.productId": product },
            { $pull: { products: { productId: product } } },
            { upsert: true }
          );
          res.json({ removeProduct: true });
        } else {
          const addOne = await cartDB.findOneAndUpdate(
            { "products.productId": product },
            {
              $inc: {
                "products.$.quantity": count,
                "products.$.total": total,
                grandtotal: price,
              },
            },
            { upsert: true }
          );
          // console.log(addOne);
          res.json(true);
        }
      }
    } catch {}
  },
  // total : async(req,res)=>{
  //   const user = await req.session.user
  //  const userId = await user._id
  //  const datas = await cartDB.findOne({userId:userId}).populate('products.productId')
  //  //console.log(datas);
  //  const product = datas.products
  //  let quantity = product.

  // }
};
