import path from "path";
import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app: Application = express();
// let corsOptions = {
//   origin: ["http://localhost:5000", "http://localhost:3000"],
//   // which url can access backend
//   // put your frontend domain/url here
// };
let corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

// origin: "*", // yo sabai url lai access dinxa
app.use(cors(corsOptions));

app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // static file serving

// Middleware
app.use(bodyParser.json());

// Admin Routes

export default app;
