
const express = require('express');
const adminControllers = require('../controllers/adminController');
const upload = require('../middleware/productMulter');

const { route } = require('./user');


const router = express.Router();

router.get('/',adminControllers.adminLogin);
router.post('/login',adminControllers.adminSign);
router.get('/dashboards',adminControllers.adminView);
router.get('/products',adminControllers.adminProduct);
router.get('/addproduct',adminControllers.addProduct);
router.post('/addproduct',upload.single('myFile'),adminControllers.addProductAdd);
router.get('/logout',adminControllers.adminLogout);
router.get('/allusers',adminControllers.admingetUsers);
router.get('/editproduct/:id',adminControllers.editProduct);
router.get('/deleteproduct/:id',adminControllers.deleteProducts);
router.post('/editproduct/:id',upload.single('myFile'),adminControllers.updateProduct);
router.get('/userblock/:id',adminControllers.blockUser);
router.get('/userUnblock/:id',adminControllers.unBlockUser);



module.exports = router;