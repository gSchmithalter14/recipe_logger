const User = require('../models/User');
const catchAsynch = require('../utils/catchAsync');

//@desc    Get all users
//@route   GET /api/v1/users
//@access  Public
exports.getUsers = catchAsynch(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

//@desc    Get a user by ID
//@route   GET /api/v1/users/:id
//@access  Public
exports.getUser = catchAsynch(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate('recipes');

  if (!user) {
    return next(new ErrorResponse('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});
