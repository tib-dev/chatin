import express from "express";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "./lib/db.config.js";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
