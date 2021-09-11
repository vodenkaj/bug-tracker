import * as userModel from "../models/userModel.js";
import * as projectModel from "../models/projectModel.js"

export const getPage = async (req, res) => {

    const projects = await userModel.getProjects(req.session.user.id);
    const tickets = await userModel.getTickets(req.session.user.id);
    const ticketCounts = await userModel.getTicketCounts(projects.map(e => parseInt(e.id)));

    res.render("index", {uname: req.session.user.first_name, uid: req.session.user.id, projects: projects, tickets: tickets, ticketCounts: ticketCounts});
}

export const createProject = async (req, res, errors) => {

    if (!errors.isEmpty()) {
        res.json({errors: errors.array()});
    } else {
        const id = await projectModel.createProject(req.session.user.id, req.body.pname);
        res.redirect(`p/${id}`);
    }
}
