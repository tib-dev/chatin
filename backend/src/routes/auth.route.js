import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  checkAuth,
  login,
  logout,
  refreshToken,
  signup,
  updateProfile,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/refresh-tokens", refreshToken);
router.post("/login", login);
router.post("/logout", logout);
router.get("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);
export default router;
