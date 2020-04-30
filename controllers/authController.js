const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const catchAsynch = require('../utils/catchAsync');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/email');

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

exports.forgotPassword = catchAsynch(async (req, res, next) => {
  //get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ErrorResponse('There is no user with that email address', 404)
    );
  }

  //generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //send it as an email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/forgotPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your password and passwordConfirm to: ${resetURL}.\n 
  If you didn't forget your password please disregard this mail`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10m)',
      message
    });
  } catch (err) {
    user.createPasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });

    return next(
      new ErrorResponse(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email!'
  });
});

exports.resetPassword = async (req, res, next) => {
  //get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  //if token not expired, and there is user, set the new password
  if (!user) {
    return next(new ErrorResponse('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //update changedPasswordAt property for the user

  //log user in, send JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(200).json({
    status: 'success',
    token
  });
};

exports.updatePassword = async (req, res, next) => {
  //get user from collection
  const user = await User.findById(req.user.id).select('+password');

  //check if posted password is correct
  if (!(await user.matchPassword(req.body.passwordCurrent, user.password))) {
    return next(ErrorResponse('Provided password is incorrect', 400));
  }
  //if correct update it
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangedAt = Date.now() - 1000;
  await user.save();
  //log the user in, send the JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(200).json({
    status: 'success',
    token
  });
};
