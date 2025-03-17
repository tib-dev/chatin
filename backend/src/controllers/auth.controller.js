import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateTokens } from "../lib/utils.js";
import cloudinary from "../lib/cloudnary.js";
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 60 * 60 * 1000, // 1 hour expiration
};

// 🔹 Sign Up User
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // 🔹 Generate Tokens
    const { accessToken, refreshToken } = await generateTokens(newUser._id);
    await User.findByIdAndUpdate(newUser._id, { refreshToken });

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      accessToken,
    });
  } catch (error) {
    console.error("Sign-up Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔹 Generate Tokens
    const { accessToken, refreshToken } = await generateTokens(user._id);
    await User.findByIdAndUpdate(user._id, { refreshToken });

    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.json({ accessToken });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Refresh Token (Token Rotation)
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.user_id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // 🔹 Generate new tokens
    const newTokens = await generateTokens(user._id);
    await User.findByIdAndUpdate(user._id, {
      refreshToken: newTokens.refreshToken,
    });

    res.cookie("refreshToken", newTokens.refreshToken, cookieOptions);
    res.json({ accessToken: newTokens.accessToken });
  } catch (error) {
    console.error("Refresh Token Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Logout (Clear refresh token)
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await User.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });
    }

    res.clearCookie("refreshToken", { ...cookieOptions, expires: new Date(0) });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // 🔹 Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    // 🔹 Update profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 🔹 Check Authentication
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Check Auth Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
