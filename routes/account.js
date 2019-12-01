const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account');
const csrf = require("../middleware/csrf");

router.get('/login',csrf,accountController.getLogin);
router.post('/login',accountController.postLogin);

router.get('/register',csrf,accountController.getRegister);
router.post('/register',accountController.postRegister);

router.get('/reset-password',csrf,accountController.getReset);
router.post('/reset-password',accountController.postReset);

router.get('/reset-password/:token',csrf,accountController.getNewPassword);
router.post('/new-password',csrf,accountController.postNewPassword);


router.get('/logout',accountController.getLogout);

module.exports = router;


