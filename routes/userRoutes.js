const express = require('express');

const userController = require('../controllers/userController');

const { getUsers, getUser } = userController;

const router = express.Router();

router.route('/').get(getUsers);

router.route('/:id').get(getUser);

module.exports = router;
