// const Recipe = require('../models/Recipe');
const Equipment = require('../models/Equipment');
const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

//@desc    Get equipment from recipe
//@route   GET /api/v1/recipes/:id/equipment
//@access  Public
exports.getAllEquipment = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.id) filter = { recipe: req.params.id };

  const equipment = await Equipment.find(filter);

  res.status(200).json({
    status: 'success',
    results: equipment.length,
    data: {
      equipment
    }
  });
});

//@desc    Add equipment item to recipe
//@route   POST /api/v1/recipes/:id/equipment
//@access  Private
exports.addEquipment = catchAsync(async (req, res, next) => {
  if (!req.body.recipe) req.body.recipe = req.params.id;
  if (!req.body.createdBy) req.body.createdBy = req.user._id;

  console.log(req.body);

  const newEquipment = await Equipment.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Equipment successfully added',
    data: {
      equipment: newEquipment
    }
  });
});

//@desc    Get an equipment item by id
//@route   GET /api/v1/recipes/:id/equipment/:equipmentId
//@access  Private
exports.getEquipment = catchAsync(async (req, res, next) => {
  const equipmentItem = await Equipment.findById(req.params.equipmentId);

  if (!equipmentItem) {
    return next(new ErrorResponse('No equipment item found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      equipmentItem
    }
  });
});

//@desc    Update a recipe equipment item
//@route   PATCH /api/v1/recipes/:id/equipment/:equipmentId
//@access  Private
exports.updateEquipment = catchAsync(async (req, res, next) => {
  let equipment = await Equipment.findById(req.params.equipmentId);

  if (!equipment) {
    return next(new ErrorResponse('No equipment item found with that ID', 404));
  }

  // check if authorized
  if (
    equipment.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse('Not authorized to update this equipment item', 403)
    );
  }

  equipment = await Equipment.findOneAndUpdate(
    req.params.equipmentId,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: 'success',
    message: 'Equipment item successfully updated',
    data: {
      equipment
    }
  });
});

//@desc    Delete a recipe equipment item
//@route   DELETE /api/v1/recipes/:id/equipment/:equipmentId
//@access  Private
exports.deleteEquipment = catchAsync(async (req, res, next) => {
  const equipment = await Equipment.findById(req.params.equipmentId);

  if (!equipment) {
    return next(new ErrorResponse('No equipment item found with that ID', 404));
  }

  // check if authorized
  if (
    equipment.createdBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse('Not authorized to delete this item', 403));
  }

  equipment.remove();

  res.status(200).json({
    status: 'success',
    message: 'Equipment item deleted'
  });
});
