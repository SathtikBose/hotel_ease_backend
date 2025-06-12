const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the person's name"],
  },
  age: {
    type: Number,
    required: [true, "Please provide the person's age"],
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: [true, "Please provide the person's gender"],
  },
  allergies: {
    type: String,
    default: "",
  },
});

const bookingSchema = new mongoose.Schema({
  bookingDate: {
    type: Date,
    required: [true, "Please provide the booking date"],
  },
  bookingTime: {
    type: String,
    required: [true, "Please provide the booking time"],
  },
  checkInTime: {
    type: String,
    required: [true, "Please provide the check-in time"],
  },
  checkOutTime: {
    type: String,
    required: [true, "Please provide the check-out time"],
  },
  checkInDate: {
    type: Date,
    required: [true, "Please provide the check-in date"],
  },
  checkOutDate: {
    type: Date,
    required: [true, "Please provide the check-out date"],
  },
  numberOfPersons: {
    type: Number,
    min: [1, "At least one person is required for booking"],
    required: [true, "Please provide the number of persons"],
  },
  persons: {
    type: [personSchema],
    validate: [
      function (val) {
        return val.length === this.numberOfPersons;
      },
      "Number of persons' details must match the number of persons",
    ],
    required: true,
  },
  parking: {
    type: Boolean,
    default: false,
  },
  flightNumber: {
    type: String,
    default: null,
  },
  idProofType: {
    type: String,
    enum: ["aadhaar", "pan", "driving_license"],
    required: [true, "Please provide the ID proof type"],
  },
  idProofNumber: {
    type: String,
    required: [true, "Please provide the ID proof number"],
  },
  nationality: {
    type: String,
    required: [true, "Please provide the nationality"],
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: [true, "Please provide the room ID"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Booking must belong to a user"],
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
