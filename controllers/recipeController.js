const Recipe = require('../models/Recipe');
const catchAsync = require('../utils/catchAsync');

//@desc    Get all recipes
//@route   GET /api/v1/recipes
//@access  Public
exports.getRecipes = catchAsync(async (req, res, next) => {
  const recipes = await Recipe.find();

  res.status(200).json({
    status: 'success',
    results: recipes.length,
    data: {
      recipes
    }
  });
});

//@desc    Get a recipe by id
//@route   GET /api/v1/recipes/:id
//@access  Public
exports.getRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      recipe
    }
  });
});

//@desc    Create new recipe
//@route   POST /api/v1/recipes
//@access  Private
exports.createRecipe = catchAsync(async (req, res, next) => {
  const newRecipe = await Recipe.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Recipe successfully created',
    data: {
      recipe: newRecipe
    }
  });
});

//@desc    Update a recipe
//@route   PATCH /api/v1/recipes/:id
//@access  Private
exports.updateRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    message: 'Recipe successfully updated',
    data: {
      recipe
    }
  });
});

//@desc    Delete a recipe
//@route   DELETE /api/v1/recipes/:id
//@access  Private
exports.deleteRecipe = catchAsync(async (req, res, next) => {
  await Recipe.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Recipe deleted'
  });
});
