const express = require('express');

const recipeController = require('../controllers/recipeController');
const authController = require('../controllers/authController');

const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe
} = recipeController;

const { protect, restrictTo } = authController;

const router = express.Router();

router
  .route('/')
  .get(protect, restrictTo('user', 'admin'), getRecipes)
  .post(protect, restrictTo('user', 'admin'), createRecipe);

router
  .route('/:id')
  .get(protect, restrictTo('user', 'admin'), getRecipe)
  .patch(protect, restrictTo('user', 'admin'), updateRecipe)
  .delete(protect, restrictTo('user', 'admin'), deleteRecipe);

module.exports = router;
