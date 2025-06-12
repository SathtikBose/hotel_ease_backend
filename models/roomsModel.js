const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  room_number: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
  bed_type: {
    type: String,
    required: true,
  },
  price_per_night: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
  max_occupancy: {
    type: Number,
    required: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  ratings: {
    type: Number,
    required: true,
  },
  reviews: {
    type: [String],
    default: [],
  },
  summary: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amenities: {
    type: [String],
    required: true,
  },
  images: {
    bathroom: {
      type: String,
      required: true,
    },
    bedroom: {
      type: String,
      required: true,
    },
    dining: {
      type: String,
      required: true,
    },
    kitchen: {
      type: String,
      required: true,
    },
    livingroom: {
      type: String,
      required: true,
    },
  },
});

roomSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
