const validator = require("validator");
const AppError = require("../utils/appError");

exports.sanitizeInput = (fields) => {
  return (req, res, next) => {
    const sanitizedBody = {};

    Object.keys(req.body).forEach((key) => {
      if (fields.includes(key)) {
        if (typeof req.body[key] === "string") {
          let sanitized = validator.escape(req.body[key].trim());
          sanitized = sanitized.replace(/[;{}()$]/g, "");
          sanitizedBody[key] = sanitized;
        } else {
          sanitizedBody[key] = req.body[key];
        }
      }
    });

    req.sanitizedBody = sanitizedBody;
    next();
  };
};

exports.validateEmail = (field) => {
  return (req, res, next) => {
    const email = req.body[field];
    if (!email || !validator.isEmail(email)) {
      return next(new AppError("Please provide a valid email address", 400));
    }
    next();
  };
};

exports.validatePassword = (field) => {
  return (req, res, next) => {
    const password = req.body[field];
    if (!password || password.length < 8) {
      return next(
        new AppError("Password must be at least 8 characters long", 400)
      );
    }
    if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      return next(
        new AppError("Password must contain both letters and numbers", 400)
      );
    }
    next();
  };
};

exports.validateName = (field) => {
  return (req, res, next) => {
    const name = req.body[field];
    if (!name || !validator.isLength(name, { min: 2, max: 50 })) {
      return next(
        new AppError("Name must be between 2 and 50 characters", 400)
      );
    }
    if (!/^[a-zA-Z\s-]+$/.test(name)) {
      return next(
        new AppError("Name can only contain letters, spaces, and hyphens", 400)
      );
    }
    next();
  };
};
