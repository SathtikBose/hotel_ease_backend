const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/usersModel");
const Booking = require("../models/bookingsModel");
const Room = require("../models/roomsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

exports.getUser = catchAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id);
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateUserBookings = catchAsync(async (req, res, next) => {
  // Expects req.body.bookings to be an array of booking IDs
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { bookings: req.body.bookings },
    { new: true, runValidators: true }
  ).populate("bookings");
  if (!user) return next(new AppError("User not found", 404));
  res.status(200).json({ status: "success", data: { user } });
});

exports.deleteUserBooking = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError("User not found", 404));
  const bookingId = req.params.bookingId;
  // Remove booking from user's bookings array
  user.bookings = user.bookings.filter((id) => id.toString() !== bookingId);
  await user.save();
  // Delete the booking and set room available to true
  const booking = await Booking.findByIdAndDelete(bookingId);
  if (booking && booking.room) {
    await Room.findByIdAndUpdate(booking.room, { available: true });
  }
  res.status(204).json({ status: "success", data: null });
});

// GET /api/v1/user/:id?populate=bookings
exports.getUserWithBookings = catchAsync(async (req, res, next) => {
  const populate = req.query.populate;
  let query = User.findById(req.params.id);
  if (populate === "bookings") {
    query = query.populate({
      path: "bookings",
      populate: { path: "room" },
    });
  }
  const user = await query;
  if (!user) return next(new AppError("No user found with that ID", 404));
  if (populate === "bookings" && user.bookings.length === 0) {
    const bookings = await Booking.find({
      // user: user._id // If you have a user field in Booking, otherwise:
      // fallback: find all bookings where the user is the owner (if such a field exists)
    }).populate("room");
    user.bookings = bookings;
  }
  res.status(200).json({ status: "success", data: { data: user } });
});
