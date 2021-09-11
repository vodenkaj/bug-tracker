import expressLoader from "./loaders/expressLoader.js"
import postgresLoader from "./loaders/postgresLoader.js"
import dotenv from "dotenv"

dotenv.config();

void (async function(){
    try {
        expressLoader();
    }
    catch(err) {
        console.log(err)
    }
})()
