const productDB = require('../models/productSchema');
const userDB = require('../models/userSchema');
const cartDB = require('../models/cartShcema');


module.exports = {
  cartView : async(req, res) => {
    const user = await req.session.user
    const userId = await user._id
    const data = await cartDB.find({userId:userId}).populate()
    console.log(data);
    //const product = data.products
    console.log(data);
    //console.log(products[0].productId.title);

    res.render("user/cart");
  },
  
 addCart :async(req,res)=>{
    // const user =  req.session.user
    // console.log(user);
    //console.log(req.body);
   
    let quantity = 1
   const productId = await req.params.id;
   const user = await req.session.user
   const userId = await user._id
   const product = await productDB.findById(productId)
//    const name = await product.title
//    const price = await product.price
  
   const userCart = await cartDB.findOne({userId:userId})
   const proD = await {productId:productId,quantity:quantity}
   const products = []
   products.push(proD)
   
   Object.assign(req.body,{userId:userId}, { products:products} );
   //console.log(req.body);
   const cartData = await req.body
   if(userCart){
    const cart = await cartDB.findOneAndUpdate({userId:userId},{$push:{products:proD}},{ upsert: true })
    res.redirect('/cart')
   }else{
    const cart = await cartDB.create(cartData)
    res.redirect('/cart')
   }
 },
   
  deleteProduct : async(req,res)=>{
     console.log(req.params.id);
     const user = await req.session.user
     const userId = await user._id
     const proId = await req.params.id
     //const proDelete = await cartDB.find({userId:userId},{proId})
     console.log(proDelete);
     res.redirect('/cart');
  }
    
  }
