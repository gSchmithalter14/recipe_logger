const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { getUsers, getUser, updateMe } = userController;

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword
} = authController;

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateMe', protect, updateMe);

router.route('/').get(getUsers);

router.route('/:id').get(getUser);

module.exports = router;
