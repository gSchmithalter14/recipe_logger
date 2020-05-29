const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { getUsers, getUser, updateMe, getMe } = userController;

const { protect } = authController;

const router = express.Router();

router.get('/me', protect, getMe);

router.patch('/updateMe', protect, updateMe);

router.route('/').get(getUsers);

router.route('/:id').get(getUser);

module.exports = router;
