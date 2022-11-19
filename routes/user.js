const express = require("express");
const userValidation = require("../controllers/joiControllers");
const userController = require("../controllers/userController");
const cartController = require('../controllers/cartController');
const router = express.Router();

router.get("/", userController.homeView);
router.get("/login", userController.loginView);
router.get("/signup", userController.signupView);
router.post("/login", userController.userLogin);
router.post("/signup", userController.userSignup);
router.get("/showProducts",userController.verifyLogin, userController.productView);
router.get("/about", userController.aboutView);
router.get("/contact", userController.contactView);
router.get("/logout", userController.logout);
router.get('/cart',userController.verifyLogin,cartController.cartView);
router.get('/addtocart/:id',userController.verifyLogin,cartController.addCart);
router.get('/cartproductdelete/:id',userController.verifyLogin,cartController.deleteProduct);

module.exports = router;
