import { body } from "express-validator";

export const messageValidator = [

    body("message")
        .trim()
        .notEmpty()
        .withMessage("Message is required")

];