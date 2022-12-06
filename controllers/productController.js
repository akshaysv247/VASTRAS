const categoryDB = require("../models/categorySchema");
const bannerDB = require("../models/banner");
const productDB = require("../models/productSchema");
const userHelper = require("../helpers/userHelper");
const wishlistDB = require("../models/wishlistSchema");

module.exports = {
  admincategory: async (req, res) => {
    try {
      const data = await categoryDB.find();
      console.log(data);
      res.render("admin/categorys", { data, error: req.flash("catErr") });
    } catch (err) {
      next(err);
    }
  },

  addCategory: async (req, res) => {
    try {
      if (req.files.length === 0) {
        const data = await categoryDB.create(req.body);
        res.redirect("/admin/category");
      } else {
        const img = [];
        req.files.forEach((element) => {
          img.push(element.filename);
        });
        Object.assign(req.body, { images: img });
        // console.log(req.body)
        const dataI = await categoryDB.create(req.body);
        res.redirect("/admin/category");
      }
    } catch (err) {
      next(err);
    }
  },
  removeCategory: async (req, res) => {
    try {
      //console.log(req.params.id);
      const catId = req.params.id;

      const find = await productDB.find({ category: catId });
      //console.log(find);
      if (find.length < 0) {
        const dele = await categoryDB.findByIdAndDelete(catId);
        res.redirect("/admin/category");
      } else {
        req.flash(
          "catErr",
          " This Catagory have some products please go and delete products"
        );
        res.redirect("/admin/category");
      }
    } catch (err) {
      next(err);
    }
  },

  categorySelect: async (req, res) => {
    try {
      const ID = req.params.id;
      const data = await productDB.find({ category: ID });
      const user = await req.session.user;

      let cartCount = null;
      let wishlist = null;
      let wishlistCount = null;
      if (user) {
        // console.log(user);
        const userId = await user._id;
        cartCount = await userHelper.getCartCount(userId);
        res.locals.cartCount = cartCount;
        wishlistCount = await userHelper.getWishListCount(user._id);
        res.locals.wishlistCount = wishlistCount;
        wishlist = await wishlistDB.findOne({ userId: userId });
      }
      res.render("user/categoryList", {
        data,
        user,
        cartCount,
        wishlist,
        wishlistCount,
      });
    } catch (err) {
      next(err);
    }
  },
};
