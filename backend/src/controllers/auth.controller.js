import { cloudinaryConfig } from "../lib/cloudnary.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokens } from "../lib/utils.js";
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 60 * 60 * 1000, // 1 hour expiration
};

// Sign up user
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    generateTokens(newUser._id, res);
    await newUser.save();
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error in sign up controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateTokens(user);
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.json({ accessToken });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Refresh Token (Token Rotation)
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.user_id);
    if (!user || !user.refreshToken) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isTokenValid) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const newTokens = await generateTokens(user);
    res.cookie("refreshToken", newTokens.refreshToken, cookieOptions);
    console.log(
      res.cookie("refreshToken", newTokens.refreshToken, cookieOptions)
    );
    res.json({ accessToken: newTokens.accessToken });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout (Clear refresh token)
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      await User.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });
    }

    res.clearCookie("refreshToken", { ...cookieOptions, expires: new Date(0) });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// update user
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    // Upload image to Cloudinary
    const updateResponse = await cloudinaryConfig.uploader.upload(profilePic);

    // Update user profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: updateResponse.secure_url },
      { new: true }
    );

    // Return updated user data
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update user controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// Check
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch {
    console.log("Error in check controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
