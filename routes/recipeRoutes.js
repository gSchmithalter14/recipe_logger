const express = require('express');

const recipeController = require('../controllers/recipeController');
const authController = require('../controllers/authController');
const stepController = require('../controllers/stepController');
const ingredientController = require('../controllers/ingredientController');
const equipmentController = require('../controllers/equipmentController');

const { protect, restrictTo, checkIfAuthor } = authController;

const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  likeRecipe,
  unlikeRecipe
} = recipeController;

const {
  getSteps,
  getStep,
  createStep,
  updateStep,
  deleteStep
} = stepController;

const {
  getIngredients,
  getIngredient,
  addIngredient,
  updateIngredient,
  deleteIngredient
} = ingredientController;

const {
  getAllEquipment,
  getEquipment,
  addEquipment,
  updateEquipment,
  deleteEquipment
} = equipmentController;

const router = express.Router();

// Recipe Routes
router
  .route('/')
  .get(protect, restrictTo('user', 'admin'), getRecipes)
  .post(protect, restrictTo('user', 'admin'), createRecipe);

router
  .route('/:id')
  .get(protect, restrictTo('user', 'admin'), getRecipe)
  .patch(protect, restrictTo('user', 'admin'), checkIfAuthor, updateRecipe)
  .delete(protect, restrictTo('user', 'admin'), checkIfAuthor, deleteRecipe);

router.route('/like/:id').put(protect, restrictTo('user'), likeRecipe);

router.route('/unlike/:id').put(protect, restrictTo('user'), unlikeRecipe);

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

// Equipment Routes
router
  .route('/:id/equipment')
  .get(protect, restrictTo('user', 'admin'), getAllEquipment)
  .post(protect, restrictTo('user', 'admin'), addEquipment);

router
  .route('/:id/equipment/:equipmentId')
  .get(protect, restrictTo('user', 'admin'), getEquipment)
  .patch(protect, restrictTo('user', 'admin'), updateEquipment)
  .delete(protect, restrictTo('user', 'admin'), deleteEquipment);

// Ingredient Routes
router
  .route('/:id/ingredients')
  .get(protect, restrictTo('user', 'admin'), getIngredients)
  .post(protect, restrictTo('user', 'admin'), addIngredient);

router
  .route('/:id/ingredients/:ingredientId')
  .get(protect, restrictTo('user', 'admin'), getIngredient)
  .patch(protect, restrictTo('user', 'admin'), updateIngredient)
  .delete(protect, restrictTo('user', 'admin'), deleteIngredient);

module.exports = router;
