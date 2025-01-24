const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1  middleware///////////////////////////////////////
//Serving Static file
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(`${__dirname}/dev-data/data`));

//third party middleware

//1. SET SECURITY HTTP HEADER
// app.use(helmet());
// Set security HTTP headers with Helmet
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
//       imgSrc: ["'self'", 'https://example.com'], // Allow images from a specific external source
//       connectSrc: ["'self'", 'ws://127.0.0.1:62318', 'https://api.example.com'], // Allow API requests to an external service
//     },
//   }),
// );

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit request from same Api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

//built-in middleware
//Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' })); //for getting access of req.body when it is passed by form
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution means remove duplicate fields and consider only one
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingAverage',
      'ratingQuantity',
      'rating',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//my middleware
//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  // console.log(req.cookies);

  next();
});

//2ROUTE HANDLERS ::::::::::::::::::::::::::::::

//3. ROUTES :::::::::::::::::::::::::::::::::::::::::::::::
//mouting
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//HANDLING ALL ROUNTING URL WHICH IS NOT DEFINED
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
