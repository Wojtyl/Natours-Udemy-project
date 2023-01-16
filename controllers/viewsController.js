const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template

  res.status(200).render('overview', {
    title: 'All Tours',
    //3) Render that template using tour data from step 1
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name'), 404);
  }
  // 2) Build template

  res.status(200).render('tour', {
    title: tour.name,
    //3) Render that template using tour data from step 1
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log in to your account',
  });
});
exports.getSignupForm = catchAsync(async (req, res, next) => {
  res.status(200).render('signup', {
    title: 'Sign Up to Natours!',
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1 Find all bookings
  const bookings = await Booking.find({ user: req.user.id });
  // 2 Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My tours',
    tours,
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id });

  const tourIDs = reviews.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  reviews.forEach((tour) => {
    console.log('TourID: ', tour.tour);
    tours.forEach((review) => {
      console.log('Review tourID: ', review.id);
      if (tour.tour === review.id) {
        tour.review = review.review;
      }
    });
  });

  // console.log(tours);
  res.status(200).render('my-reviews', {
    title: 'My reviews',
    reviews,
    tours,
  });
});

exports.updateUserData = async (req, res, next) => {
  // const updatedUser = await User.findByIdAndUpdate(
  //   req.user.id,
  //   {
  //     name: req.body.name,
  //     email: req.body.email,
  //   },
  //   {
  //     new: true,
  //     runValidators: true,
  //   }
  // );

  res.status(200).render('account', {
    title: 'Your account',
    // user: updatedUser,
  });
};
