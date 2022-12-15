const express = require("express");
const adminControllers = require("../controllers/adminController");
const upload = require("../middleware/productMulter");
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')

const { route } = require("./user");

const router = express.Router();

router.get("/", adminControllers.adminLogin);
router.post("/login", adminControllers.adminSign);
router.get("/dashboards", adminControllers.adminView);
router.get("/products",adminControllers.verifyLoginAdmin,adminControllers.adminProduct);
router.get("/addproduct",adminControllers.verifyLoginAdmin, adminControllers.addProduct);
router.post("/addproduct",adminControllers.verifyLoginAdmin,upload,adminControllers.addProductAdd);
router.get("/logout", adminControllers.adminLogout);
router.get("/allusers",adminControllers.verifyLoginAdmin, adminControllers.admingetUsers);
router.get("/editproduct/:id", adminControllers.editProduct);
router.get("/deleteproduct/:id", adminControllers.deleteProducts);
router.get("/activeproduct/:id",adminControllers.productActive);
router.post("/editproduct/:id",upload,adminControllers.updateProduct);
router.get("/userblock/:id", adminControllers.blockUser);
router.get("/userUnblock/:id", adminControllers.unBlockUser);
router.get('/category',adminControllers.verifyLoginAdmin,productController.admincategory);
router.post('/category',upload,productController.addCategory);
router.get('/deletecategory/:id',productController.removeCategory);
router.get("/orders",adminControllers.verifyLoginAdmin,adminControllers.orderDetails);
router.get("/banner",adminControllers.verifyLoginAdmin,adminControllers.getBannerPage);
router.post("/banner",upload,adminControllers.addBanner);
router.get("/remove-banner/:id",adminControllers.removeBanner);
router.get("/coupons",adminControllers.verifyLoginAdmin,adminControllers.getCouponsPage);
router.get("/add-coupon",adminControllers.verifyLoginAdmin,adminControllers.addCoupon);
router.post("/add-coupon",adminControllers.addCouponAdd);
router.get("/activate-product/:id",adminControllers.activateCoupons);
router.get("/deletecoupon/:id",adminControllers.deletecoupon)
router.get("/view-product/:id",adminControllers.viewOrdersProduct);
router.post("/update-order",adminControllers.orderStatus);
router.get("/revenue",adminControllers.totalRevenue);
router.get("/cahrt",adminControllers.salesPieTotal);
router.get("/sales-report",adminControllers.verifyLoginAdmin,adminControllers.salesReport)


module.exports = router;
