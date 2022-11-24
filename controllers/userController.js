const { response } = require("../app");
const userHelper = require("../helpers/userHelper");
const { message } = require("../models/joiShcema");
const userValidation = require("./joiControllers");
const productHelper = require("../helpers/productHelpers");
const productDB = require("../models/productSchema");
const userDB = require("../models/userSchema");
const cartDB = require("../models/cartShcema");
const Twilio = require("../middleware/otpVerification");
const adressDB = require("../models/adressScema");

//For Register Page
const homeView = async (req, res, next) => {
  try {
    const user = req.session.user;
    res.locals.user = user || null;
    let cartCount = null;
    if (user) {
      // console.log(user);
      cartCount = await userHelper.getCartCount(user._id);
      res.locals.cartCount = cartCount;
    }
    //console.log(cartCount);
    res.render("user/home", { user, cartCount });
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

const userLogin = (req, res, next) => {
  try {
    userHelper.userLogin(req.body).then((response) => {
      //console.log(response);
      if (response.status) {
        req.session.loggedIn = true;
        req.session.user = response.user;

        res.redirect("/");
      } else {
        req.flash("userErr", "Incorrect username or password ! ");
        res.redirect("/login");
      }
    });
  } catch (err) {
    next(err);
  }
};

const otpSend = (req, res) => {
  try {
    res.render("user/otplogin");
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
    let data = req.session.temp;
    // console.log(data);
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
    if (user) {
      // console.log(user);
      cartCount = await userHelper.getCartCount(user._id);
      res.locals.cartCount = cartCount;
    }
    productHelper.productsUserSide().then((data) => {
      //console.log(data);
      res.render("user/shope", { data, user, cartCount });
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
    const address = await adressDB.find({ userId: userId });
    //console.log(address);
    res.render("user/profile", { user, address });
  } catch (err) {
    next(err);
  }
};

const addAdress = (req, res, next) => {
  try {
    res.render("user/adress");
  } catch (err) {
    next(err);
  }
};
const saveAdress = async (req, res, next) => {
  try {
    const user = req.session.user;
    const userId = user._id;
    Object.assign(req.body, { userId: userId });
    const data = req.body;
    const save = await adressDB.create(data);
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
};

const editAddress = async (req, res, next) => {
  try {
    const user = req.session.user;
    const userId = user._id;
    const Id = req.params.id;
    //console.log(Id);
    const data = await adressDB.findOne({ _id: Id });
    // console.log(data);
    res.render("user/editaddress", { data });
  } catch (err) {
    next(err);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    //console.log(req.params.id);
    const Id = req.params.id;
    const remove = await adressDB.findByIdAndRemove(Id);
    res.redirect("/profile");
  } catch (err) {
    next(err);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const data = req.body;
    const ID = req.params.id;
    const update = await adressDB.findOneAndUpdate(
      { _id: ID },
      {
        $set: {
          name: data.name,
          phoneNumber: data.phoneNumber,
          pincode: data.pincode,
          locality: data.locality,
          adress: data.adress,
          city: data.city,
          landmark: data.landmark,
          AlternatePhone: data.AlternatePhone,
          state: data.state,
        },
      }
    );

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
    const all = await productDB.find({ active: true });
    const product = await productDB.findOne({ _id: ID });
    // console.log(product);
    res.render("user/singleproduct", { product, all, user });
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
};
