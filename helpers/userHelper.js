const { response } = require("../app");
const dbUser = require("../models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../models/productSchema");
const { reject } = require("bcrypt/promises");
const { verifySMS } = require("../middleware/otpVerification");
const cartDB = require("../models/cartShcema");
const wishlistDB = require("../models/wishlistSchema");

module.exports = {
  signinData: (userData, next) => {
    try {
      //console.log(userData);
      return new Promise(async (resolve, reject) => {
        const user = await dbUser.findOne({ Email: userData.Email });

        if (!user) {
          userData.Password = await bcrypt.hash(userData.Password, 10);
          await dbUser.create(userData).then((data) => {
            //console.log(data);
            resolve(data);
          });
        } else {
          reject(Error);
        }
      });
    } catch (err) {
      next(err);
    }
  },

  userLogin: (userData, next) => {
    try {
      return new Promise(async (resolve, reject) => {
        let loginStatus = false;
        let response = {};
        const user = await dbUser.findOne({
          $and: [{ Email: userData.Email }, { is_active: true }],
        });
        //console.log(user);

        if (user) {
          bcrypt.compare(userData.Password, user.Password).then((status) => {
            if (status) {
              console.log("login success");
              response.user = user;
              response.status = true;
              resolve(response);
            } else {
              console.log("login failed");
              resolve({ Password: true });
            }
          });
        } else {
          console.log("Email Failed");
          resolve({ Email: true });
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // userLogin:(userData)=>{
  //     return new Promise (async(resolve,reject)=>{
  //         console.log(userData);
  //         const user = await db.findOne({Email:userData.Email},).then((result)=>{
  //             if(result==null){
  //                 resolve(false)
  //             }
  //             else{
  //                 resolve(true)
  //             }
  //         })
  //     })
  // }

  getAllUsers: (next) => {
    try {
      return new Promise((resolve, reject) => {
        dbUser.find().then((data) => {
          resolve(data);
        });
      });
    } catch (err) {
      next(err);
    }
  },

  getCartCount: (userId, next) => {
    try {
      return new Promise(async (resolve, reject) => {
        let count = null;
        const cart = await cartDB.findOne({ userId: userId });
        if (cart) {
          count = cart.products.length;
        }
        resolve(count);
      });
    } catch (err) {
      next(err);
    }
  },

  getWishListCount: (userId, next) => {
    try {
      return new Promise(async (resolve, reject) => {
        let count = null;
        const wishlist = await wishlistDB.findOne({ userId: userId });
        if (wishlist) {
          count = wishlist.products.length;
        }
        resolve(count);
      });
    } catch (err) {
      next(err);
    }
  },
};
