import PG from "pg"

const pool = new PG.Pool();

export function query(text, params) {
    return pool.query(text, params);
}
