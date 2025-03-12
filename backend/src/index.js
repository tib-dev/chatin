import express from "express";
import { connectDB } from "./lib/db.config.js";
import dotenv from "dotenv";
import CookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "./lib/cors.config.js";
import router from "./routes/index.js";
dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors(corsOptions)); // Ensure CORS is allowed
app.use(express.json()); // Ensure JSON body parsing
app.use(CookieParser()); // Ensure cookies are parsed
app.use(router);

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
