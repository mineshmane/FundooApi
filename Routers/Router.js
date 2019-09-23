const userController = require('../controllers/UserController');

const express = require('express');
const auth = require('../middleware/Authentication');
const router = express.Router();

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser)

router.post('/forgetPassword', userController.forgetPassword)
// router.post('/reset:token',userController.resetPassword)
router.post('/reset',auth,userController.resetPassword)

console.log(" in the router ");
module.exports = router;