const { check } = require("express-validator");

const validatorMiddleware = require('../middelware/validatorMiddleware');
const users = require('../models/user');

exports.signupValidator = [
  check("userName").notEmpty().withMessage("Username is required"),
  check("phone").notEmpty().withMessage("phone is required"),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      users.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in user"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  
  check("dateOfBirth")
    .notEmpty()
    .withMessage("dateOfBirth is required"),  
  
    check("graduationYear")
    .notEmpty()
    .withMessage("graduationYear is required"),

  validatorMiddleware,
];

exports.loginValidation = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  validatorMiddleware,
];
