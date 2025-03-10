import express from "express";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "./lib/db.config.js";
import dotenv from "dotenv";
import CookieParser from "cookie-parser";
dotenv.config();
const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
// Middleware
app.use(express.json()); // Ensure JSON body parsing
app.use(CookieParser()); // Ensure cookies are parsed
app.use("/api/auth", authRouter);

const startServer = async () => {
  try {
    await connectDB(); // Ensure MongoDB is connected before starting the server
    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
