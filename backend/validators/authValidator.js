import { body } from "express-validator";

export const registerValidator = [
  body("name").notEmpty().withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .isIn(["spouse", "parent", "ngo", "volunteer"])
    .withMessage("Invalid role"),

  body("city").notEmpty().withMessage("City is required"),

  body("state").notEmpty().withMessage("State is required"),

  body("militaryIdNumber")
    .notEmpty()
    .withMessage("Military ID Number is required"),
];

export const loginValidator = [
  body("email").isEmail(),

  body("password").notEmpty(),
];