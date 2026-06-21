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
import billRouter from "./business/bill/route/bill.route";
import paymentRouter from "./customer/payment/route/payment.route";
import { CORS_ORIGINS } from "./config/env";

const app: Application = express();
const corsOptions = {
  origin: CORS_ORIGINS,
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // static file serving

// Middleware
app.use(bodyParser.json());

// Business Routes
app.use("/api/business", businessRouter);
app.use("/api/restaurants", restaurantRouter);
app.use("/api/tables", tableRouter);
app.use("/api/menu", menuRouter);

// Customer Session Routes
app.use("/api/sessions", sessionRouter);
app.use("/api/order", orderRouter);
app.use("/api/suggestion", suggestionRouter);
app.use("/api/bill", billRouter);
app.use("/api/payment", paymentRouter);

export default app;
