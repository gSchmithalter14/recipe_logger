const express = require('express');

const authController = require('../controllers/authController');

const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword
} = authController;

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updatePassword', protect, updatePassword);

module.exports = router;
