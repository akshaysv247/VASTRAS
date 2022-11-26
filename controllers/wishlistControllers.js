const wishlistDB = require('../models/wishlistSchema')
const productDB = require('../models/productSchema')
const userHelper = require('../helpers/userHelper')

module.exports = {
    wishlistView: async (req, res, next) => {
       
          const user = await req.session.user;
          const userId = await user._id;
          let cartCount = null;
          if (user) {
            // console.log(user);
            cartCount = await userHelper.getCartCount(user._id);
            res.locals.cartCount = cartCount;
          }
          const datas = await wishlistDB
            .findOne({ userId: userId })
            .populate("products.productId");
            let product = datas.products;
          
          
          //console.log(product);
          //console.log(products[0].productId.title);
    
          res.render("user/wishlist", { product, user, datas, cartCount });
       
      },
    
      addWishlist: async (req, res, next) => {

          const productId = await req.params.id;
          const user = await req.session.user;
          const userId = await user._id;
          const product = await productDB.findById(productId);
          //    const name = await product.title
          //    const price = await product.price
          //console.log(product);
          const userwishlist = await wishlistDB.findOne({ userId: userId });
          //console.log(userCart);
         
          // console.log(total);
          const proD = await { productId: productId}
            
          
          const products = [];
          products.push(proD);
    
          Object.assign(
            req.body,
            { userId: userId },
            { products: products }
            
          );
          //console.log(req.body);
          const wishlistData = await req.body;
          // console.log(cartData);
          if (userwishlist) {
            
            
              const wishlist = await wishlistDB.findOneAndUpdate(
                { userId: userId },
                { $push: { products: proD } },
                { upsert: true }
              );
              
              // console.log(cart);
              //res.redirect('/cart')
              res.json({ status: true });
            }
           else {
            const cart = await wishlistDB.create(wishlistData);
            // res.redirect('/cart')
            res.json({ status: true });
          }
       
      },

      deleteProduct: async (req, res, next) => {
       
          //console.log(req.body);
          //console.log(req.params.id);
          const user = await req.session.user;
          const userId = await user._id;
          const proId = await req.params.id;
          //   const price = await cartDB.find({ userId: userId },{ products: {productId:proId}},"products.$.productId.total")
          //   console.log(product);
          //   console.log(price);
    
          const proDelete = await wishlistDB.findOneAndUpdate(
            { userId: userId },
            { $pull: { products: { productId: proId } } }
          );
          //   const priceIncrese = await cartDB.findOneAndUpdate({userId:userId},{$inc:{grandtotal:-price}})
    
         
          res.json({ status: true });
          //res.redirect("/wishlist");
      },
}