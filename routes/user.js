
const express = require('express');
const userValidation = require('../controllers/joiControllers');
const userController = require('../controllers/userController');
const router = express.Router();


router.get('/',userController.homeView);
router.get('/login', userController.loginView);
router.get('/signup',userController.signupView);
router.post('/login',userController.userLogin);
router.post('/signup',userController.userSignup)
router.get('/showProducts',userController.productView);


module.exports = router;