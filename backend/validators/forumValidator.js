import { body } from "express-validator";

export const createForumValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required"),

  body("topic")
    .notEmpty()
    .withMessage("Topic is required"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),
];