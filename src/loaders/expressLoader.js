import express from "express"
import {config as cfg} from "../config.js"
import router from "../routes/index.js"
import session from "express-session";

function expressLoader() {
    const app = express();

    app.set("view engine", "ejs")
    app.use(express.static("public"))

    app.use(session({
        secret: cfg.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {sameSite: true}
    }));

    app.use(router);
    const server = app.listen(cfg.PORT, cfg.ADDRESS, () => {
        const { address, port } = server.address()
        console.log(`Server is running at address: http://${address}:${port}`)
    })
}

export default expressLoader;
