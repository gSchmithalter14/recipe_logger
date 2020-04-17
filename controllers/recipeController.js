const catchAsync = require('../utils/catchAsync');

exports.getRecipes = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'get recipes',
  });
};

exports.getRecipe = (req, res, next) => {
  const id = req.params.id;
  res.status(200).json({
    success: true,
    message: `get recipe with id ${id}`,
  });
};

exports.createRecipe = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'create recipes',
  });
};

exports.updateRecipe = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'update recipes',
  });
};

exports.deleteRecipe = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'delete recipes',
  });
};
