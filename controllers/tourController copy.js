const fs = require('fs');
// const Tour = require('../models/tourModel');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkID = (req, res, next, val) => {
  // console.log(`Tour id is ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  // console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  // // if (id > tours.length)
  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  const newTour = { ...req.body, id: newId };
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(404).json({
          status: 'fail',
        });
      }
      res.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    },
  );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...',
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          'https://unpkg.com',
          'https://cdnjs.cloudflare.com', // Add cdnjs for compatibility
        ],
        scriptSrcElem: [
          "'self'",
          'https://unpkg.com',
          'https://cdnjs.cloudflare.com', // Match scriptSrc
        ],
        connectSrc: [
          "'self'",
          'https://unpkg.com',
          ...['ws://127.0.0.1:*'], // Allow WebSocket in development
        ],
        styleSrc: [
          "'self'",
          'https://unpkg.com',
          'https://fonts.googleapis.com', // Allow styles from Google Fonts
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com', // Allow fonts from Google Fonts
        ],
        imgSrc: [
          "'self'",
          'https://unpkg.com',
          'data:',
          '<URL>', // Add the specific image URL here
        ],
      },
    },
  }),
);

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: [
//           "'self'",
//           'https://unpkg.com',
//           'https://cdnjs.cloudflare.com', // Add cdnjs for compatibility
//         ],
//         scriptSrcElem: [
//           "'self'",
//           'https://unpkg.com',
//           'https://cdnjs.cloudflare.com', // Match scriptSrc
//         ],
//         connectSrc: [
//           "'self'",
//           'https://unpkg.com',
//           ...['ws://127.0.0.1:*'], // Allow WebSocket in development
//         ],
//         styleSrc: [
//           "'self'",
//           'https://unpkg.com',
//           'https://fonts.googleapis.com', // Allow styles from Google Fonts
//         ],
//         fontSrc: [
//           "'self'",
//           'https://fonts.gstatic.com', // Allow fonts from Google Fonts
//         ],
//         imgSrc: [
//           "'self'",
//           'https://unpkg.com',
//           'data:',
//           '<URL>', // Add the specific image URL here
//         ],
//       },
//     },
//   }),
// );
