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
  .get(protect, restrictTo('user'), getRecipes)
  .post(protect, restrictTo('user'), createRecipe);

router
  .route('/:id')
  .get(getRecipe)
  .patch(updateRecipe)
  .delete(deleteRecipe);

module.exports = router;
