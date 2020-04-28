const Recipe = require('../models/Recipe');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

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
  const recipe = await Recipe.findById(req.params.id)
    .populate({ path: 'steps', select: 'title description' })
    .populate({ path: 'ingredients', select: 'name' })
    .populate({ path: 'equipment', select: 'name' });

  if (!recipe) {
    return next(new ErrorResponse('No recipe found with that ID', 404));
  }

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
  if (!req.body.createdBy) req.body.createdBy = req.user._id;

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

  if (!recipe) {
    return next(new ErrorResponse('No recipe found with that ID', 404));
  }

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
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return next(new ErrorResponse('No recipe found with that ID', 404));
  }

  recipe.remove();

  res.status(200).json({
    status: 'success',
    message: 'Recipe successfully deleted'
  });
});

//@desc    Like a recipe
//@route   PUT /api/v1/recipes/like/:id
//@access  Private
exports.likeRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  console.log(recipe);

  // Check if the psot has already been liked
  if (
    recipe.likes.filter((like) => like.user.toString() === req.user.id).length >
    0
  ) {
    return next(new ErrorResponse('Recipe already liked', 400));
  }

  recipe.likes.unshift({ user: req.user.id });

  await recipe.save();

  const likes = recipe.likes.length;

  res.status(200).json({
    status: 'success',
    data: {
      likes
    }
  });
});

//@desc    Unlike a recipe
//@route   PUT /api/v1/recipes/unlike/:id
//@access  Private
exports.unlikeRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  // Check if the psot has already been liked
  if (
    recipe.likes.filter((like) => like.user.toString() === req.user.id)
      .length === 0
  ) {
    return next(new ErrorResponse('Recipe has not yet been liked', 400));
  }

  const removeIndex = recipe.likes.map((like) =>
    like.user.toString().indexOf(req.user.id)
  );

  recipe.likes.splice(removeIndex, 1);

  await recipe.save();

  const likes = recipe.likes.length;

  res.status(200).json({
    status: 'success',
    data: {
      likes
    }
  });
});
