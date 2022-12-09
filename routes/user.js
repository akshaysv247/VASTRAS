const express = require("express");
const userValidation = require("../controllers/joiControllers");
const userController = require("../controllers/userController");
const cartController = require('../controllers/cartController');
const router = express.Router();
const wishlistController = require('../controllers/wishlistControllers')
const productController  = require('../controllers/productController');
const orderController = require('../controllers/orderControllers');

router.get("/", userController.homeView);
router.get("/login", userController.loginView);
router.get("/signup", userController.signupView);
router.post("/login", userController.userLogin);
router.post("/signup", userController.userSignup);
router.get("/showProducts", userController.productView);
router.get("/about", userController.aboutView);
router.get("/contact", userController.contactView);
router.get("/logout", userController.logout);
router.get('/cart',userController.verifyLogin,cartController.cartView);
router.get('/addtocart/:id',userController.verifyLogin,cartController.addCart);
router.get('/cartproductdelete/:id',userController.verifyLogin,cartController.deleteProduct);
router.get('/otplogin',userController.otpSend);
router.post("/otplogin",userController.postOTP);
router.post("/change-product-quantity",cartController.changeProductQuantity);
router.get("/profile",userController.verifyLogin,userController.viewProfile);
router.get("/addadress",userController.addAdress);
router.post("/addadress",userController.saveAdress);
router.get("/editaddress/:id",userController.editAddress);
router.post("/editaddress/:id",userController.updateAddress);
router.get("/deleteaddress/:id",userController.deleteAddress);
router.get("/product/:id",userController.singleProduct);
router.get("/addwishlist/:id",wishlistController.addWishlist);
router.get("/wishlist",userController.verifyLogin,wishlistController.wishlistView);
router.get("/wishlistproductdelete/:id",userController.verifyLogin,wishlistController.deleteProduct);
router.get("/categoryproduct/:id", productController.categorySelect);
router.get("/checkout",userController.verifyLogin,orderController.checkOutPage);
router.post("/placeorder",userController.verifyLogin,orderController.orderConform);
router.get("/vieworders/:id",orderController.viewOreders);
router.post("/verify-Payment",orderController.verifyPayment);
router.get("/order-conform/:id",userController.verifyLogin,orderController.thankYou);
router.post("/apply-coupon",orderController.applyCoupon);
router.get("/order-cancel/:id",orderController.orderCancel);
router.get("/order-list",userController.verifyLogin,orderController.orderListUserSide);
router.post("/search-Products",userController.productSearch);
router.get("/resend-otp",userController.otpResend);
router.post("/user-profile-edit/:id",userController.userProfileEdit)


module.exports = router;
