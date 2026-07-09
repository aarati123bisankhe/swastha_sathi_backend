import express, { Application,Request, Response } from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from "path";
import { HttpError } from "./errors/http-error.ts";
import authRoutes from "./routes/auth.routes.ts";
import liveLocationRoutes from "./routes/live-location.routes.ts";

dotenv.config();
console.log(process.env.PORT);

const app: Application = express();

let corsOptions = {
    origin: ["http://localhost:3000"] 
}

app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: "15mb" }));
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads"))); //protect uploads folder from being accessed directly
app.use('/api/auth', authRoutes);
app.use('/api/location', liveLocationRoutes);

app.use((err: Error, req: Request, res: Response, next: Function) => {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    return res.status(500).json({ success: false, message: err.message || "Internal Server Error" });
});

export default app;
