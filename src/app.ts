import path from "path";
import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import businessRouter from "./business/auth/route/business.route";

const app: Application = express();
let corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

// origin: "*", // yo sabai url lai access dinxa
app.use(cors(corsOptions));

app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // static file serving

// Middleware
app.use(bodyParser.json());

// Business Routes
app.use("/api/business", businessRouter);

export default app;
