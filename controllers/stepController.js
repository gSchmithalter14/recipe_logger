// const Recipe = require('../models/Recipe');
const Step = require('../models/Step');
const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

//@desc    Get steps from recipe
//@route   GET /api/v1/recipes/:id/steps
//@access  Private
exports.getSteps = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.id) filter = { recipe: req.params.id };

  const steps = await Step.find(filter);

  res.status(200).json({
    status: 'success',
    results: steps.length,
    data: {
      steps
    }
  });
});

//@desc    Create new recipe step
//@route   POST /api/v1/recipes/:id/steps
//@access  Private
exports.createStep = catchAsync(async (req, res, next) => {
  if (!req.body.recipe) req.body.recipe = req.params.id;

  const newStep = await Step.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Step successfully created',
    data: {
      step: newStep
    }
  });
});

//@desc    Get a step by id
//@route   GET /api/v1/recipes/:id/steps/:stepId
//@access  Public
exports.getStep = catchAsync(async (req, res, next) => {
  const step = await Step.findById(req.params.stepId);

  if (!step) {
    return next(new ErrorResponse('No step found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      step
    }
  });
});

//@desc    Update a recipe step
//@route   PATCH /api/v1/recipes/:id/steps/:stepId
//@access  Private
exports.updateStep = catchAsync(async (req, res, next) => {
  const step = await Step.findByIdAndUpdate(req.params.stepId, req.body, {
    new: true,
    runValidators: true
  });

  if (!step) {
    return next(new ErrorResponse('No step found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Step successfully updated',
    data: {
      step
    }
  });
});

//@desc    Delete a recipe step
//@route   DELETE /api/v1/recipes/:id/steps/:stepId
//@access  Private
exports.deleteStep = catchAsync(async (req, res, next) => {
  const step = await Step.findByIdAndDelete(req.params.stepId);
  if (!step) {
    return next(new ErrorResponse('No step found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Step deleted'
  });
});
