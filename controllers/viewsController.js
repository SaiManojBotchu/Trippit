const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const Booking = require('./../models/bookingModel');
const User = require('./../models/userModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tours data from collection
  const features = new APIFeatures(Tour.find(), req.query).filter().sort();
  const tours = await features.query;
  // const tours = await Tour.find();

  // 2) Build template
  // 3) Render template using tour data
  res.status(200).render('overview', {
    title: 'All tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection using slug
  const tour = await Tour.findOne({ slug: req.params.slug }).populate(
    'reviews'
  );

  if (!tour) {
    return next(new AppError('There is no tour with that name'));
  }
  // 2) Build template
  // 3) Render template using tour data
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create Your account'
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
