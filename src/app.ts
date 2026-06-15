import path from "path";
import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import businessRouter from "./business/auth/route/business.route";
import restaurantRouter from "./business/restaurant/route/restaurant.route";
import tableRouter from "./business/table/route/table.route";
import menuRouter from "./business/menu/route/menu.route";
import sessionRouter from "./customer/session/route/session.route";
import orderRouter from "./customer/order/route/order.route";
import suggestionRouter from "./customer/suggestion/route/suggestion.route";

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
app.use("/api/restaurants", restaurantRouter);
app.use("/api/tables", tableRouter);
app.use("/api/menu", menuRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/order", orderRouter);
app.use("/api/suggestion", suggestionRouter);
export default app;
