const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authentication');
const adminController = require('../controllers/admin');
const locals = require("../middleware/locals");
const adminAuth = require('../middleware/adminAuth');



router.get('/products', locals, isAuthenticated, adminAuth, adminController.getProducts);

router.get('/add-product', locals, isAuthenticated, adminAuth, adminController.getAddProduct);

router.post('/add-product', locals, isAuthenticated, adminAuth, adminController.postAddProduct);

router.get('/products/:productid', locals, isAuthenticated, adminAuth, adminController.getEditProduct);

router.post('/products', locals, isAuthenticated, adminAuth, adminController.postEditProduct);

router.post('/delete-product', locals, isAuthenticated, adminAuth, adminController.postDeleteProduct);

router.get('/categories', locals, isAuthenticated, adminAuth, adminController.getCategories);

router.get('/add-category', locals, isAuthenticated, adminAuth, adminController.getAddCategory);

router.post('/add-category', isAuthenticated, adminAuth, adminController.postAddCategory);

router.get('/categories/:categoryid', locals, isAuthenticated, adminAuth, adminController.getEditCategory);

router.post('/categories', locals, isAuthenticated, adminAuth, adminController.postEditCategory);

router.post('/delete-category', locals, isAuthenticated, adminAuth, adminController.postDeleteCategory);


module.exports = router;