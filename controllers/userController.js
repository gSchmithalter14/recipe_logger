const User = require('../models/User');
const catchAsynch = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

//@desc filter request body to return only email and username. This way users cannot update fields
//they should not be updating like role
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

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
  const user = await User.findById(req.params.id).populate({
    path: 'recipes',
    select: 'name description'
  });

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

//@desc    Get current logged in user
//@route   GET /api/v1/users/me
//@access  Private
exports.getMe = catchAsynch(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(
      new ErrorResponse(
        'You are not logged in! Please log in to get access',
        401
      )
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

//@desc    Get a user by ID
//@route   GET /api/v1/users/:id
//@access  Private
exports.updateMe = catchAsynch(async (req, res, next) => {
  //create error if users POST password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new ErrorResponse(
        'This route is not for password updates. Please use, update my password',
        400
      )
    );
  }
  //filtered out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'username', 'email');
  //update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});
