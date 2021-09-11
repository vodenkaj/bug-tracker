import {Router} from 'express'
import {router as login} from "./login.js"
import {router as bugs} from "./bugs.js"
import express from 'express'

// Controller imports
import * as homeController from "../controllers/homeController.js";
import * as authController from "../controllers/middleware/isAuth.js"
import * as projectController from "../controllers/projectController.js"

import {check, validationResult} from "express-validator"

const router = Router();

const projectValidate = check("pname", "Invalid project name").trim().escape().isLength({min: 3});

router.use(login);

router.use("", (req, res, next) => {
    authController.isLoggedIn(req, res, next);
})

router.get("", (req, res) => {
    homeController.getPage(req, res);
})

router.get("/projects/:id*", express.urlencoded({extended: true}), (req, res, next) => {
    projectController.getPage(req, res, next);
})

router.use("/*", (req, res) => {
    res.render("error", {uid: req.session.user.id, uname: req.session.user.name});
})

router.post("/projects/:id/submit/issue", express.urlencoded({extended: true}), (req, res) => {
    projectController.postNewIssue(req ,res);
})

router.post("/projects/create", express.urlencoded({extended: true}), projectValidate, (req,  res) => {
    homeController.createProject(req, res, validationResult(req));
})

//router.use(bugs);

export default router;
