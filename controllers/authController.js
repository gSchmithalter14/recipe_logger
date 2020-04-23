const User = require('../models/User');
const catchAsynch = require('../utils/catchAsync');

exports.register = catchAsynch(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});
