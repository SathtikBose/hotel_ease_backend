const Room = require("../models/roomsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getRooms = catchAsync(async (req, res, next) => {
  const data = await Room.find();
  res.status(200).json({
    status: "success",
    result: data.length,
    data,
  });
});

exports.getRoom = catchAsync(async (req, res, next) => {
  const { _id } = req.params;
  const data = await Room.findById(_id);
  if (!data) {
    return next(new AppError("No room found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    result: 1,
    data,
  });
});

// Sorting endpoints you can try:
// GET /api/v1/room/sort?sortBy=floor&order=asc      // Sort by floor ascending
// GET /api/v1/room/sort?sortBy=floor&order=desc     // Sort by floor descending
// GET /api/v1/room/sort?sortBy=price&order=asc      // Sort by price low to high
// GET /api/v1/room/sort?sortBy=price&order=desc     // Sort by price high to low
// GET /api/v1/room/sort?sortBy=capacity&order=asc   // Sort by capacity low to high
// GET /api/v1/room/sort?sortBy=capacity&order=desc  // Sort by capacity high to low
// GET /api/v1/room/sort?sortBy=rating&order=asc     // Sort by rating low to high
// GET /api/v1/room/sort?sortBy=rating&order=desc    // Sort by rating high to low

exports.sortRooms = catchAsync(async (req, res, next) => {
  const { sortBy, order } = req.query;
  let sortOptions = {};

  if (sortBy === "floor") {
    sortOptions.floor = order === "desc" ? -1 : 1;
  } else if (sortBy === "price") {
    sortOptions["price_per_night"] = order === "desc" ? -1 : 1;
  } else if (sortBy === "capacity") {
    sortOptions["max_occupancy"] = order === "desc" ? -1 : 1;
  } else if (sortBy === "rating") {
    sortOptions["ratings"] = order === "desc" ? -1 : 1;
  }

  const data = await Room.find().sort(sortOptions);
  res.status(200).json({
    status: "success",
    result: data.length,
    data,
  });
});
