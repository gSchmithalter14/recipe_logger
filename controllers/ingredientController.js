// const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

//@desc    Get ingredients from recipe
//@route   GET /api/v1/recipes/:id/ingredients
//@access  Private
exports.getIngredients = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.id) filter = { recipe: req.params.id };

  const ingredients = await Ingredient.find(filter);

  res.status(200).json({
    status: 'success',
    results: ingredients.length,
    data: {
      ingredients
    }
  });
});

//@desc    Add ingredient to recipe
//@route   POST /api/v1/recipes/:id/ingredient
//@access  Private
exports.addIngredient = catchAsync(async (req, res, next) => {
  if (!req.body.recipe) req.body.recipe = req.params.id;
  if (!req.body.createdBy) req.body.createdBy = req.user._id;

  const newIngredient = await Ingredient.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Ingredient successfully added',
    data: {
      step: newIngredient
    }
  });
});

//@desc    Get an ingredient by id
//@route   GET /api/v1/recipes/:id/ingredients/:ingredientId
//@access  Private
exports.getIngredient = catchAsync(async (req, res, next) => {
  const ingredient = await Ingredient.findById(req.params.ingredientId);

  console.log(ingredient);
  console.log(req.user.id);

  if (!ingredient) {
    return next(new ErrorResponse('No ingredient found with that ID', 404));
  }

  // check if authorized
  if (!(req.user.id.toString() === ingredient.createdBy.toString())) {
    return next(new ErrorResponse('Invalid user', 403));
  }

  res.status(200).json({
    status: 'success',
    data: {
      ingredient
    }
  });
});

//@desc    Update a recipe ingredient
//@route   PATCH /api/v1/recipes/:id/ingredients/:ingredientId
//@access  Private
exports.updateIngredient = catchAsync(async (req, res, next) => {
  let ingredient = await Ingredient.findById(req.params.ingredientId);

  if (!ingredient) {
    return next(new ErrorResponse('No ingredient found with that ID', 404));
  }

  // check if authorized
  if (
    ingredient.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse('Not authorized to update this ingredient', 403)
    );
  }

  ingredient = await Ingredient.findOneAndUpdate(
    req.params.ingredientId,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    message: 'Ingredient successfully updated',
    data: {
      ingredient
    }
  });
});

//@desc    Delete a recipe ingredient
//@route   DELETE /api/v1/recipes/:id/ingredients/:ingredientId
//@access  Private
exports.deleteIngredient = catchAsync(async (req, res, next) => {
  const ingredient = await Ingredient.findById(req.params.ingredientId);

  if (!ingredient) {
    return next(new ErrorResponse('No ingredient found with that ID', 404));
  }

  // check if authorized
  if (
    ingredient.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse('Not authorized to delete this ingredient', 403)
    );
  }

  ingredient.remove();

  res.status(200).json({
    status: 'success',
    message: 'Ingredient deleted'
  });
});
