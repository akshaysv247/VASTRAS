const category = require("../models/categorySchema");
const bannerDB = require('../models/banner')
const productDB = require('../models/productSchema')

module.exports = {
  admincategory: async (req, res) => {
    const data = await category.find();
    console.log(data);
    res.render("admin/categorys", { data });
  },

  addCategory: async (req, res) => {
   
    if (req.files.length === 0) {
      const data = await category.create(req.body);
    res.redirect("/admin/category");
      }
     else {
      const img = [];
      req.files.forEach((element) => {
        img.push(element.filename);
      });
      Object.assign(req.body, { images : img });
      // console.log(req.body)
      const dataI = await category.create(req.body);
      res.redirect("/admin/category");
      }
    }
    ,

  removeCategory: async (req, res) => {

    //console.log(req.params.id);
    const catId = req.params.id;
    const dele = await category.findByIdAndDelete(catId);
    res.redirect("/admin/category");
  },

  categorySelect : async (req,res)=>{
    const ID = req.params.id;
    const data = await productDB.find({category:ID})
    const user = await req.session.user;
    
    let cartCount = null;
    let wishlist = null
    if (user) {
      // console.log(user);
      const userId = await user._id;
      cartCount = await userHelper.getCartCount(userId);
      res.locals.cartCount = cartCount;
       wishlist = await wishlistDB.findOne({userId:userId})
    }
    res.render("user/categoryList",{data,user,cartCount,wishlist})

  },

};
