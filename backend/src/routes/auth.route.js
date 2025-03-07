import express from "express";
const router = express.Router();

router.post("/signup", (req, res) => {
  res.send("Signup");
});
router.post("/login", (req, res) => {
  res.send("login");
});

router.post("/logout", (req, res) => {
  res.send("logout");
});
