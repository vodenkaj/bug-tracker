import * as db from "../db/index.js"

export const getProjectName = async (projectId) => {
    const result = (await db.query("SELECT name FROM project WHERE id = $1", [projectId])).rows;
    return result.length > 0 ? result[0].name : "";
}
export const createProject = async (userId, name) => {
    const id = (await db.query("INSERT INTO project (name) VALUES ($1) RETURNING id", [name])).rows[0].id;
    await db.query("INSERT INTO project_users VALUES ($1, $2, $3)", [id, userId, 1]);
    return id;
}
export const getTicketCounts = async (projectId) => {
    const ticketCounts = (await db.query(
        "WITH status AS (" +
        "SELECT status FROM ticket WHERE project_id = $1)" +
        "(SELECT COUNT(*) FROM status WHERE status = 1)" +
        "UNION ALL" +
        "(SELECT COUNT(*) FROM status WHERE status = 2)" +
        "UNION ALL" +
        "(SELECT COUNT(*) FROM status WHERE status = 3)",
        [projectId])).rows;
    return ticketCounts;
}

export const getTickets = async (projectId) => {
    const tickets = (await db.query("SELECT * FROM ticket_info WHERE project_id = $1", [projectId])).rows;
    return tickets;
}

export const getUser = async (userId, projectId) => {
    const user = (await db.query("SELECT * FROM project_users WHERE user_id = $1 AND project_id = $2", [userId, projectId])).rows;
    return user;
}

export const postNewIssue =  async (userId, projectId, body) => {

    await db.query("INSERT INTO ticket (project_id, created_by, attached_to, severity, status, name, description) VALUES ($1, $2, $3, $4, $5, $6, $7)", [projectId, userId, body.asignee, body.severity, 1, body.title, body.desc]);

    return null;
}
