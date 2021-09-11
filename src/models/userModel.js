import * as db from "../db/index.js"

export const getOne = async (email) => {
    return (await db.query("SELECT * FROM public.user WHERE email = $1", [email])).rows[0];
}

export const getProjects = async (userId) => {
    return (await db.query("SELECT name, to_char(created_at, 'Mon DD YYYY') AS created_at, id FROM project LEFT JOIN project_users on id = project_id WHERE user_id = $1", [userId])).rows;
}

export const getTicketCounts = async (projectsId) => {
    return (await db.query("SELECT COUNT(id) FROM ticket WHERE project_id = ANY ($1)", [projectsId])).rows[0].count;
}

export const getTickets = async (userId) => {
    return (await db.query("SELECT id, name FROM ticket WHERE created_by = $1", [userId])).rows;
}

export const create = async (email, password, first_name, last_name) => {
    return (await db.query("INSERT INTO public.user (email, password, first_name, last_name) VALUES($1, $2, $3, $4)", [email, password, first_name, last_name]));
}
