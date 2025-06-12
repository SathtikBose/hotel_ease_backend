const Booking = require("../models/bookingsModel");
const Room = require("../models/roomsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllBookings = catchAsync(async (req, res, next) => {
  // Only get bookings for the logged-in user
  const bookings = await Booking.find({ user: req.user.id }).populate("room");
  res.status(200).json({
    status: "success",
    results: bookings.length,
    data: { bookings },
  });
});

exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate("room");
  if (!booking) return next(new AppError("No booking found with that ID", 404));
  res.status(200).json({ status: "success", data: { booking } });
});

exports.createBooking = catchAsync(async (req, res, next) => {
  // Add the logged-in user's ID to the booking
  req.body.user = req.user.id;
  const booking = await Booking.create(req.body);
  await Room.findByIdAndUpdate(booking.room, { available: false });
  res.status(201).json({ status: "success", data: { booking } });
});

exports.updateBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("room");
  if (!booking) return next(new AppError("No booking found with that ID", 404));
  res.status(200).json({ status: "success", data: { booking } });
});

exports.deleteBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return next(new AppError("No booking found with that ID", 404));
  await Room.findByIdAndUpdate(booking.room, { available: true });
  res.status(204).json({ status: "success", data: null });
});
