const express = require("express");
const bookingsController = require("../controller/bookingsController");
const authController = require("../controller/authController");

const router = express.Router();

router.use(authController.protected);

router
  .route("/")
  .get(bookingsController.getAllBookings)
  .post(bookingsController.createBooking);

router
  .route(":id")
  .get(bookingsController.getBooking)
  .patch(bookingsController.updateBooking)
  .delete(bookingsController.deleteBooking);

module.exports = router;
