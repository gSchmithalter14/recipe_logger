const express = require('express');
const morgan = require('morgan');

const recipeRouter = require('./routes/recipeRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Body parser
app.use(express.json());

app.use(morgan('dev'));

// ROUTES
app.use('/api/v1/recipes', recipeRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
