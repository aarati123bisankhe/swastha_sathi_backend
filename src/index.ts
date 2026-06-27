import app from "./app.ts";
import { PORT } from "./configs/index.ts";
import http from "http";
import { connectDB } from "./database/mangodb.ts";

//server part
async function startServer(){
    await connectDB();
    const server = http.createServer(app);

    server.listen(
        PORT,
        () =>{
            console.log(`Server: http://localhost:${PORT}`);
        }
    )
}

startServer();