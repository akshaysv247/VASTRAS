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
router.get("/products", adminControllers.adminProduct);
router.get("/addproduct", adminControllers.addProduct);
router.post("/addproduct",upload,adminControllers.addProductAdd);
router.get("/logout", adminControllers.adminLogout);
router.get("/allusers", adminControllers.admingetUsers);
router.get("/editproduct/:id", adminControllers.editProduct);
router.get("/deleteproduct/:id", adminControllers.deleteProducts);
router.get("/activeproduct/:id",adminControllers.productActive);
router.post("/editproduct/:id",upload,adminControllers.updateProduct);
router.get("/userblock/:id", adminControllers.blockUser);
router.get("/userUnblock/:id", adminControllers.unBlockUser);
router.get('/category',productController.admincategory);
router.post('/category',upload,productController.addCategory);
router.get('/deletecategory/:id',productController.removeCategory);
router.get("/orders",adminControllers.orderDetails);

module.exports = router;
