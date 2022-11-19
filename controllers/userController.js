const { response } = require("../app");
const userHelper = require("../helpers/userHelper");
const { message } = require("../models/joiShcema");
const userValidation = require("./joiControllers");
const productHelper = require("../helpers/productHelpers");
const productDB = require('../models/productSchema');
const userDB = require('../models/userSchema');
const cartDB = require('../models/cartShcema');

//For Register Page
const homeView = (req, res) => {
  const user = req.session.user;
  res.locals.user = user || null;
  res.render("user/home", { user });
};

const signupView = (req, res) => {
  res.render("user/signup", { error: req.flash("userErr") });
};

const loginView = (req, res) => {
  if (!req.session.loggedIn) {
    res.render("user/login", { error: req.flash("userErr") });
  } else {
    res.redirect("/");
  }
};

const userLogin = (req, res) => {
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
};

const userSignup = async (req, res) => {
  let validate = await userValidation(req);
  if (validate === true) {
    userHelper
      .signinData(req.body)
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
   // console.log(message);
    req.flash("userErr", " User Data not filled");
    res.redirect("/signup");
  }
};

const productView = (req, res) => {
  productHelper.productsUserSide().then((data) => {
    res.render("user/shope", { data });
  });
};

const verifyLogin = (req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}



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
  
  contactView,
  productView,
  logout,
 
  verifyLogin
};
