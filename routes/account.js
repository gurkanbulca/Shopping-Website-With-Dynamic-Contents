const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account');
const locals = require("../middleware/locals");


router.get('/login',locals,accountController.getLogin);
router.post('/login',accountController.postLogin);

router.get('/register',locals,accountController.getRegister);
router.post('/register',accountController.postRegister);

router.get('/reset-password',locals,accountController.getReset);
router.post('/reset-password',accountController.postReset);

router.get('/reset-password/:token',locals,accountController.getNewPassword);
router.post('/new-password',locals,accountController.postNewPassword);


router.get('/logout',accountController.getLogout);

module.exports = router;


