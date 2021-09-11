import * as projectModel from "../models/projectModel.js";
import * as auth from "../services/auth.js"

export const getPage = async (req, res, next) => {

    if (auth.hasUserAuth(req.session.user.id, req.params.id)) {
        const name = (await projectModel.getProjectName(req.params.id)).replaceAll(" ", "-");

        if (name == "")
            return next();

        if (req.url.split("/").pop() !== name) {
            res.redirect(`/projects/${req.params.id}/${name}`);
            return;
        }

        const ticketCounts = await projectModel.getTicketCounts(req.params.id);
        const tickets = await projectModel.getTickets(req.params.id);

        res.render("bugs", {uid: req.session.user.id, uname: req.session.user.name, prjid: req.params.id, ticketCounts: ticketCounts, tickets: tickets});
    } else {
        res.send("No acess!");
    }
}

export const postNewIssue = (req, res) => {

    const body = req.body;

    const result = projectModel.postNewIssue(req.session.user.id, req.params.id, body);
}
