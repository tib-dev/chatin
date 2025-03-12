import express from "express";
import authRouter from "./auth.route.js";
import messagesRouter from "./messages.route.js";

const router = express.Router();

router.use("/api/auth", authRouter);
router.use("/api/messages", messagesRouter);

export default router;
