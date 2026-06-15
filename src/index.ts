import dotenv from "dotenv";
import app from "./app";
import connectDB from "./database/db";
import { initializeSocket } from "./socket/socket";
import http from "http";

dotenv.config();

const PORT = process.env.PORT;

// database connection
connectDB();

const server = http.createServer(app);

initializeSocket(server);

// Start Server
server.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});
