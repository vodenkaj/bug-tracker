import PG from "pg"

export default async function connectPostgres() {
    const client = new PG.Client({
        host: process.env.PGHOST,
        port: process.env.PGPORT,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDBNAME
    });

    await client.connect();
    console.log("Postgres connect!")
}
