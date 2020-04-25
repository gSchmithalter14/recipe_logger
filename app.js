const express = require('express');
const morgan = require('morgan');

const ErrorResponse = require('./utils/errorResponse');
const globalErrorHandler = require('./controllers/errorController');
const recipeRouter = require('./routes/recipeRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Body parser
app.use(express.json());

app.use(morgan('dev'));

// app.use((req, res, next) => {
//   console.log(req.headers);
//   next();
// });

// ROUTES
app.use('/api/v1/recipes', recipeRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
