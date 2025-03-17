import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    // Extract token from Authorization header or cookies
    const token =
      req.headers["authorization"]?.split(" ")[1] || req.cookies.jwt;

    if (!token) {
      console.log("Access denied: No token provided.");
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
    } catch (error) {
      console.log("Invalid or expired token:", error.message);
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid or expired token" });
    }

    if (!decoded?.user_id) {
      console.log("Invalid token structure.");
      return res
        .status(401)
        .json({ message: "Unauthorized - Invalid token structure" });
    }

    const user = await User.findById(decoded.user_id).select("-password");
    if (!user) {
      console.log("User not found for token ID:", decoded.id);
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
