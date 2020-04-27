const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const catchAsynch = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');

//@desc    Register a new user
//@route   POST /api/v1/users/register
//@access  Public
exports.register = catchAsynch(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

//@desc    Login an existing user
//@route   POST /api/v1/users/login
//@access  Public
exports.login = catchAsynch(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password, user.password))) {
    return next(new ErrorResponse('Incorrect email or password', 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(200).json({
    status: 'success',
    token
  });
});

//@desc    Route protection middleware
exports.protect = catchAsynch(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new ErrorResponse(
        'You are not logged in! Please log in to get access',
        401
      )
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new ErrorResponse('The user belonging to this token does not exist')
    );
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new ErrorResponse(
        'User recently changed password! Please log in again',
        401
      )
    );
  }

  req.user = user;

  next();
});

//@desc    Authorization - restrict certain routes based on user role
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          'You do not have permission to perform this action',
          403
        )
      );
    }
    next();
  };
};

exports.checkIfAuthor = async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!(req.user._id.toString() === recipe.createdBy._id.toString())) {
    return next(new ErrorResponse('Invalid user', 403));
  }

  next();
};
