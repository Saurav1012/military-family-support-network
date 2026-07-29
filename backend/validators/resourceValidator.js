import { body } from "express-validator";

export const createResourceValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("category")
    .notEmpty()
    .withMessage("Category is required"),

  body("contactEmail")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Invalid email address"),

  body("contactPhone")
    .optional({ checkFalsy: true })
    .isLength({ min: 10, max: 15 })
    .withMessage("Invalid phone number"),

  body("website")
    .optional({ checkFalsy: true })
    .isURL()
    .withMessage("Invalid website URL"),
];