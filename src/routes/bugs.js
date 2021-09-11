import {Router} from 'express'
import express from 'express'

export const router = Router();
import * as projectController from "../controllers/projectController.js"

router.get("/bugs", (req, res) => {
    res.render("bugs", {prjId: 1});
})

router.post("/:id/submit-new-issue", express.urlencoded({extended: true}), (req, res) => {
    projectController.postNewIssue(req ,res);
})
