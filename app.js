const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

const ErrorResponse = require('./utils/errorResponse');
const globalErrorHandler = require('./controllers/errorController');
const recipeRouter = require('./routes/recipeRoutes');
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent coss site scripting - XSS
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 100, //10 minutes
  max: 100 //100 requests
});

app.use(limiter);

// Prevent http param pollution
app.use(hpp());

app.use(cors());

app.use(morgan('dev'));

// ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/recipes', recipeRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new ErrorResponse(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
