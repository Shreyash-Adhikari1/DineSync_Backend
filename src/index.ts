import dotenv from "dotenv";
import app from "./app";
import connectDB from "./database/db";
dotenv.config();

// const app: Application = express();
const PORT = process.env.PORT;

//database connection
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});
