const userHelper = require("../helpers/userHelper");
const userValidation = require("./joiControllers");
const productHelper = require("../helpers/productHelpers");
const productDB = require("../models/productSchema");
const userDB = require("../models/userSchema");
const cartDB = require("../models/cartShcema");
const Twilio = require("../middleware/otpVerification");
const adressDB = require("../models/adressScema");
const wishlistDB = require("../models/wishlistSchema");
const categoryDB = require("../models/categorySchema");
const bannerDB = require("../models/banner");
const loginValidation = require("../validation/login");
const url = require("url");
const querystring = require("querystring");
const otpValidations = require("../validation/otpcenter");
const addressValidation = require("../validation/address");
const userNewData = require("../validation/profileeidt");
const bcrypt = require("bcrypt");

//For Register Page
const homeView = async (req, res, next) => {
  try {
    const user = req.session.user;
    res.locals.user = user || null;
    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      // console.log(user);
      cartCount = await userHelper.getCartCount(user._id);
      res.locals.cartCount = cartCount;
      wishlistCount = await userHelper.getWishListCount(user._id);
      res.locals.wishlistCount = wishlistCount;
    }
    const banner = await bannerDB.findOne({});
    console.log(banner);
    const cat = await categoryDB.find({});
    const product = await productDB.find({}).populate("category").limit(5)
    //console.log(product);

    //console.log(banner);

    //console.log(cartCount);
    res.render("user/home", {
      user,
      cartCount,
      cat,
      banner,
      product,
      wishlistCount,
    });
  } catch (err) {
    next(err);
  }
};

const signupView = (req, res, next) => {
  try {
    res.render("user/signup", { error: req.flash("userErr") });
  } catch (err) {
    next(err);
  }
};

const loginView = (req, res, next) => {
  try {
    if (!req.session.loggedIn) {
      res.render("user/login", { error: req.flash("userErr") });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    next(err);
  }
};

const userLogin = async (req, res, next) => {
  try {
    let validate = await loginValidation(req);
    if (validate == true) {
      userHelper.userLogin(req.body).then((response) => {
        //console.log(response);
        if (response.status) {
          req.session.loggedIn = true;
          req.session.user = response.user;

          res.redirect("/");
        } else {
          console.log(response);
          if (response.Password) {
            req.flash("userErr", "Incorrect password ! ");
            res.redirect("/login");
          } else {
            req.flash("userErr", "Incorrect email ! ");
            res.redirect("/login");
          }
        }
      });
    } else {
      console.log(validate);

      req.flash("userErr", "Email must be a valid email ");
      res.redirect("/login");
    }
  } catch (err) {
    next(err);
  }
};

const otpSend = (req, res) => {
  try {
    res.render("user/otplogin", { error: req.flash("userErr") });
  } catch (err) {
    next(err);
  }
};

const otpResend = async (req, res, next) => {
  try {
    Error.stackTraceLimit = Infinity;
    let data = req.session.temp;
    const number = data.PhoneNumber;
    console.log(number);
    const resend = await Twilio.sendSMS(number);
    res.json({ status: true });
  } catch (err) {
    next(err);
  }
};

// const userOtp = async (req, res)=>{
//   //const number = req.session.phone
//  // console.log(data);
//   console.log(req);
//   const sms= await otp.sendSMS(req).then((response)=>{

//     res.redirect("/otplogin")

//   })

// }

const postOTP = async (req, res, next) => {
  try {
    let validate = await otpValidations(req);
    if (validate === true) {
      let data = req.session.temp;
      // console.log(data);
      Error.stackTraceLimit = Infinity;
      const otp = req.body.otp;
      const number = data.PhoneNumber;
      const getOtp = await Twilio.verifySMS(number, otp).then(
        (verification_check) => {
          //console.log(response);
          if (verification_check.status == "approved") {
            userHelper
              .signinData(data)
              .then((response) => {
                // console.log(response);
                res.redirect("/login");
              })
              .catch((resolve) => {
                // console.log(resolve);
                req.flash("userErr", " Email already used");
                res.redirect("/signup");
              });
          } else {
            res.redirect("/signup");
          }
        }
      );
    } else {
      req.flash("userErr", "  please enter the otp");
      res.redirect("/otplogin");
    }
  } catch (err) {
    next(err);
  }
};

const userSignup = async (req, res, next) => {
  try {
    let validate = await userValidation(req);
    req.session.temp = req.body;
    const number = req.body.PhoneNumber;
    //console.log(number);
    if (validate === true) {
      if (number) {
        const sms = await Twilio.sendSMS(number).then((response) => {
          res.redirect("/otplogin");
        });
      } else {
        res.redirect("/signup");
      }
    } else {
      // console.log(message);
      req.flash("userErr", " User Data not filled");
      res.redirect("/signup");
    }
  } catch (err) {
    next(err);
  }
};

const productView = async (req, res, next) => {
  try {
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
      //console.log(wishlist);
    }
    const cat = await categoryDB.find({});

    //console.log(wishlist);
    productHelper.productsUserSide().then((data) => {
      //console.log(data);
      res.render("user/shope", {
        data,
        user,
        cartCount,
        wishlist,
        cat,
        wishlistCount,
      });
    });
  } catch (err) {
    next(err);
  }
};

const verifyLogin = (req, res, next) => {
  try {
    if (req.session.loggedIn) {
      next();
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    next(err);
  }
};

const viewProfile = async (req, res, next) => {
  try {
    const user = req.session.user;
    const userId = user._id;
    //console.log(userId);
    let address = null;
    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      // console.log(user);
      cartCount = await userHelper.getCartCount(user._id);
      res.locals.cartCount = cartCount;
      wishlistCount = await userHelper.getWishListCount(user._id);
      res.locals.wishlistCount = wishlistCount;
    }
    const addressData = await adressDB.findOne({ userId: userId });
    if (addressData) {
      address = addressData.address;
    }
    // console.log(address);

    res.render("user/profile", {
      user,
      address,
      cartCount,
      wishlistCount,
      addressData,
      error: req.flash("userErr"),
    });
  } catch (err) {
    next(err);
  }
};

const addAdress = async (req, res, next) => {
  try {
    const user = await req.session.user;
    const userId = await user._id;
    let cartCount = null;
    let wishlistCount = null;

    if (user) {
      // console.log(user);
      cartCount = await userHelper.getCartCount(user._id);
      res.locals.cartCount = cartCount;
      wishlistCount = await userHelper.getWishListCount(user._id);
      res.locals.wishlistCount = wishlistCount;
    }
    res.render("user/adress", {
      error: req.flash("userErr"),
      user,
      cartCount,
      wishlistCount,
    });
  } catch (err) {
    next(err);
  }
};
const saveAdress = async (req, res, next) => {
  try {
    let validate = await addressValidation(req);
    if (validate === true) {
      const user = req.session.user;
      const userId = user._id;
      const newAddress = req.body;
      console.log(newAddress);
      const addressdata = [];
      addressdata.push(newAddress);
      const data = {};

      Object.assign(data, { userId: userId }, { address: addressdata });

      const find = await adressDB.findOne({ userId: userId });

      if (find) {
        const add = await adressDB.findOneAndUpdate(
          { userId: userId },
          { $push: { address: newAddress } },
          { upsert: true }
        );
      } else {
        const save = await adressDB.create(data);
      }
      res.redirect("/profile");
    } else {
      req.flash("userErr", " Please full fill the form and please avoid space");
      res.redirect("/addadress");
    }
  } catch (err) {
    next(err);
  }
};

const editAddress = async (req, res, next) => {
  try {
    const user = req.session.user;
    const userId = user._id;
    const Id = req.params.id;

    let cartCount = null;
    let wishlistCount = null;

    if (user) {
      // console.log(user);
      cartCount = await userHelper.getCartCount(user._id);
      res.locals.cartCount = cartCount;
      wishlistCount = await userHelper.getWishListCount(user._id);
      res.locals.wishlistCount = wishlistCount;
    }
    const add = await adressDB.findOne({ userId: userId });

    // console.log(add);

    if (add) {
      const adressExist = await add.address.findIndex(
        (element) => element._id == Id
      );
      // console.log(adressExist);
      const data = add.address[adressExist];
      //console.log(data)
      res.render("user/editaddress", {
        data,
        user,
        cartCount,
        wishlistCount,
        error: req.flash("userErr"),
      });
    }
  } catch (err) {
    next(err);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    console.log(req.params.id);
    const Id = req.params.id;
    const user = req.session.user;
    const userId = user._id;
    const remove = await adressDB.findOneAndUpdate(
      { userId: userId },
      { $pull: { address: { _id: Id } } },
      { upsert: true }
    );
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data);
    const ID = req.params.id;
    console.log(ID);
    const user = req.session.user;
    const userId = user._id;
    const address = await adressDB.findOne({ userId: userId });
    console.log(address);
    if (address) {
      const update = await adressDB.updateMany(
        { "address._id": ID },
        {
          $set: {
            "address.$.name": data.name,
            "address.$.phoneNumber": data.phoneNumber,
            "address.$.pincode": data.pincode,
            "address.$.locality": data.locality,
            "address.$.adress": data.adress,
            "address.$.city": data.city,
            "address.$.landmark": data.landmark,
            "address.$.AlternatePhone": data.AlternatePhone,
            "address.$.state": data.state,
          },
          new: true,
        },
        { upsert: true }
      );
    }

    //console.log(data);
    //console.log(update);
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
};

const singleProduct = async (req, res, next) => {
  try {
    const ID = req.params.id;
    const user = req.session.user;
    //console.log(ID);
    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      // console.log(user);
      cartCount = await userHelper.getCartCount(user._id);
      res.locals.cartCount = cartCount;
      wishlistCount = await userHelper.getWishListCount(user._id);
      res.locals.wishlistCount = wishlistCount;
    }
    const all = await productDB.find({ active: true }).populate("category");
    const product = await productDB.findOne({ _id: ID });
    // console.log(product);
    res.render("user/singleproduct", {
      product,
      all,
      user,
      cartCount,
      wishlistCount,
    });
  } catch (err) {
    next(err);
  }
};

const productSearch = async (req, res, next) => {
  try {
    console.log(req.body);
    const user = req.session.user;
    const searchdata = req.body.data;
    let qData = new RegExp(searchdata, "i");
    let data = await productDB.find({ title: { $regex: qData } });
    //console.log(data);

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
    const cat = await categoryDB.find({});
    res.render("user/searchproduct", {
      data,
      user,
      cartCount,
      wishlistCount,
      cat,
    });
  } catch (err) {
    next(err);
  }
};

const userProfileEdit = async (req, res, next) => {
  try {
    // console.log(req.body);
    let validation = userNewData(req).then(async (response) => {
      if (response == true) {
        const userId = req.params.id;
        const Name = req.body.Name;
        const Email = req.body.Email;
        const PhoneNumber = req.body.PhoneNumber;
        const find = await userDB.findOne({ _id: userId });
        const edit = await userDB.findOneAndUpdate(
          { _id: userId },
          {
            $set: {
              Name: req.body.Name,
              Email: req.body.Email,
              PhoneNumber: req.body.PhoneNumber,
            },
            new: true,
          },
          { upsert: true }
        );

        res.redirect("/profile");
      } else {
        req.flash("userErr", " Please full fill the form");
        res.redirect("/profile");
      }
    });
  } catch (err) {
    next(err);
  }
};

const viewMobileEnter = (req, res, next) => {
  try {
    res.render("user/forgotteNumber");
  } catch (err) {
    next(err);
  }
};

const getMobileEnter = async (req, res, next) => {
  try {
    const number = req.body.PhoneNumber;

    const findNumber = await userDB.find({ PhoneNumber: number });

    if (findNumber.length > 0) {
      req.session.forgot = number;
      const send = await Twilio.sendSMS(number).then(() => {
        res.json({ status: true });
      });
    } else {
      res.json({ status: false });
    }
  } catch (err) {
    next(err);
  }
};

const returnData = async (req, res, next) => {
  try {
    Error.stackTraceLimit = Infinity;
    const number = req.session.forgot;
    const otp = req.body.otp;
    console.log(req.body);
    const verifyForgot = await Twilio.verifySMS(number, otp).then(
      (verification_check) => {
        //console.log(response);
        if (verification_check.status == "approved") {
          res.json({ number });
        } else {
          res.json({ otp });
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

const viewEnterNewPass = (req, res, next) => {
  try {
    res.render("user/newpassword");
  } catch (err) {
    next(err);
  }
};

const getNewPass = async (req, res, next) => {
  try {
    console.log(req.body);
    const Email = req.body.Email;
    const Password = req.body.Password;
    const user = await userDB.findOne({ Email: Email });
    if (user) {
      const newPassword = await bcrypt.hash(Password, 10);
      const update = await userDB.findOneAndUpdate(
        { Email: Email },
        {
          $set: {
            Password: newPassword,
          },
          new: true,
        },
        { upsert: true }
      );
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (err) {
    next(err);
  }
};

const contactView = (req, res) => {
  res.render("user/contact");
};
const aboutView = (req, res) => {
  res.render("user/about");
};
const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

module.exports = {
  homeView,
  signupView,
  loginView,
  userLogin,
  userSignup,
  aboutView,
  otpSend,
  contactView,
  productView,
  logout,
  postOTP,
  verifyLogin,
  viewProfile,
  addAdress,
  saveAdress,
  editAddress,
  deleteAddress,
  updateAddress,
  singleProduct,
  productSearch,
  otpResend,
  userProfileEdit,
  viewMobileEnter,
  getMobileEnter,
  returnData,
  viewEnterNewPass,
  getNewPass,
};
