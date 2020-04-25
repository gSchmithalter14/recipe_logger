const express = require('express');

const recipeController = require('../controllers/recipeController');

const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe
} = recipeController;

const router = express.Router();

router
  .route('/')
  .get(getRecipes)
  .post(createRecipe);

router
  .route('/:id')
  .get(getRecipe)
  .patch(updateRecipe)
  .delete(deleteRecipe);

module.exports = router;
