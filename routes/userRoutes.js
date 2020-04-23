const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { getUsers, getUser } = userController;

const { register, login } = authController;

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.route('/').get(getUsers);

router.route('/:id').get(getUser);

module.exports = router;
