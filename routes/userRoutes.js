const router = require("express").Router();
const authController = require("../controller/authController");
const userController = require("../controller/userController");
const {
  validateEmail,
  validatePassword,
  validateName,
  sanitizeInput,
} = require("../middleware/validate");
router.post(
  "/signup",
  sanitizeInput(["name", "email", "password", "passwordConfirm"]),
  validateName("name"),
  validateEmail("email"),
  validatePassword("password"),
  authController.signup
);
router.post(
  "/login",
  sanitizeInput(["email", "password"]),
  validateEmail("email"),
  authController.login
);
router.get("/isLoggedIn", authController.isLoggedIn);
router.post("/logout", authController.logout);
router.post(
  "/forgotPassword",
  sanitizeInput(["email"]),
  validateEmail("email"),
  authController.forgotPassword
);
router.post(
  "/resetPassword/:token",
  sanitizeInput(["password", "passwordConfirm"]),
  validatePassword("password"),
  authController.resetPassword
);
router.use(authController.protected);
router.patch(
  "/updateMyPassword",
  sanitizeInput(["passwordCurrent", "password", "passwordConfirm"]),
  validatePassword("password"),
  authController.updatePassword
);
router.patch(
  "/updateMe",
  sanitizeInput(["name", "email"]),
  validateName("name"),
  validateEmail("email"),
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.patch("/updateBookings", userController.updateUserBookings);
router.delete("/deleteBooking/:bookingId", userController.deleteUserBooking);
router.get("/:id", userController.getUserWithBookings);
module.exports = router;
