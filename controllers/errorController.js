const ErrorResponse = require('../utils/errorResponse');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ErrorResponse(message, 400);
};

const handleDuplicateDB = (duplicate) => {
  const message = `Duplicate field value: (${duplicate}). Please use another value`;
  return new ErrorResponse(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ErrorResponse(message, 400);
};

const sendError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      error: err,
      status: err.status,
      message: err.message
    });
  } else {
    console.error('ERROR ❌❌❌', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateDB(error.keyValue.name);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

  sendError(error, res);
};