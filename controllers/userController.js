exports.getUsers = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'get users',
  });
};

exports.getUser = (req, res, next) => {
  const id = req.params.id;
  res.status(200).json({
    success: true,
    message: `get user with id ${id}`,
  });
};
