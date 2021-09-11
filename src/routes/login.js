import express from "express"
import {check, validationResult} from "express-validator"
import * as authController from "../controllers/authController.js"

const loginValidate = [
    check("email", "Invalid email").isEmail()
        .trim().escape().normalizeEmail(),
    check("psw").isLength({ min: 8 })
        .withMessage("Password must be atleast 8 character long")
        .matches("[0-9]").withMessage("Password must contain a number")
        .matches("[A-Z]").withMessage("Password must contain an uppercase letter")
        .trim().escape()
]

export const router = express.Router();

router.get("/signup", (req, res) => {
    authController.getSignUp(req, res);
})

router.get("/signin", (req, res) => {
    authController.getSignIn(req, res);
})

router.post("/signin", express.urlencoded({extended: true}), loginValidate, (req, res) => {
    authController.postSignIn(req, res, validationResult(req));
})

router.post("/signup", express.urlencoded({extended: true}), loginValidate, (req, res) => {
    authController.postSignUp(req, res, validationResult(req));
})
