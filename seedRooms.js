// Script to seed rooms data into MongoDB
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../config.env") });

const Room = require("../models/roomsModel");

const db_string = process.env.DB_STRING.replace(
  "<DB_PASSWORD>",
  process.env.DB_PASSWORD
);

async function seedRooms() {
  try {
    await mongoose.connect(db_string);
    console.log("Connected to MongoDB");
    const rooms = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../data/rooms.json"), "utf-8")
    );
    await Room.deleteMany();
    await Room.insertMany(rooms);
    console.log("Rooms data seeded successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedRooms();
