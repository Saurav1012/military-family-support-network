import { body } from "express-validator";

export const createCommunityValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .notEmpty()
    .withMessage("Description is required"),

  body("location")
    .notEmpty()
    .withMessage("Location is required"),

  body("category")
    .notEmpty()
    .withMessage("Category is required"),
];