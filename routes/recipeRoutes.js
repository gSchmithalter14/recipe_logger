const express = require('express');

const recipeController = require('../controllers/recipeController');
const authController = require('../controllers/authController');
const stepController = require('../controllers/stepController');

const { protect, restrictTo } = authController;

const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe
} = recipeController;

const {
  getSteps,
  createStep,
  getStep,
  deleteStep,
  updateStep
} = stepController;

const router = express.Router();

// Recipe Routes
router
  .route('/')
  .get(protect, restrictTo('user', 'admin'), getRecipes)
  .post(protect, restrictTo('user', 'admin'), createRecipe);

router
  .route('/:id')
  .get(protect, restrictTo('user', 'admin'), getRecipe)
  .patch(protect, restrictTo('user', 'admin'), updateRecipe)
  .delete(protect, restrictTo('user', 'admin'), deleteRecipe);

// Step Routes
router
  .route('/:id/steps')
  .get(protect, restrictTo('user', 'admin'), getSteps)
  .post(protect, restrictTo('user', 'admin'), createStep);

router
  .route('/:id/steps/:stepId')
  .get(protect, restrictTo('user', 'admin'), getStep)
  .patch(protect, restrictTo('user', 'admin'), updateStep)
  .delete(protect, restrictTo('user', 'admin'), deleteStep);

module.exports = router;
