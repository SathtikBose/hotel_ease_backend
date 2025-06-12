const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });
const db_string = process.env.DB_STRING.replace(
  "<DB_PASSWORD>",
  process.env.DB_PASSWORD
);
const connectDB = async () => {
  try {
    await mongoose.connect(db_string);
    console.log("connected to database");
  } catch (err) {
    console.log("DB connection error:", err);
  }
};
module.exports = connectDB;
