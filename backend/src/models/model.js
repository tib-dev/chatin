const mongoose = require("mongoose");

// User Schema
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Message Schema
const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String },
    messageType: {
      type: String,
      enum: ["text", "image", "video", "file", "voice"],
      default: "text",
    },
    voiceMessage: { type: String, default: "" }, // URL to voice message file
    seen: { type: Boolean, default: false },
    deletedBySender: { type: Boolean, default: false },
    deletedByReceiver: { type: Boolean, default: false },
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        type: {
          type: String,
          enum: ["like", "love", "laugh", "sad", "angry", "wow"],
        },
      },
    ],
  },
  { timestamps: true }
);

// Chat Schema
const ChatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

// Group Schema
const GroupSchema = new mongoose.Schema(
  {
    groupName: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

// Call Schema
const CallSchema = new mongoose.Schema(
  {
    caller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    callType: { type: String, enum: ["audio", "video"], required: true },
    callStatus: {
      type: String,
      enum: ["ongoing", "ended", "missed"],
      default: "ongoing",
    },
    callDuration: { type: Number, default: 0 }, // in seconds
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = {
  User: mongoose.model("User", UserSchema),
  Message: mongoose.model("Message", MessageSchema),
  Chat: mongoose.model("Chat", ChatSchema),
  Group: mongoose.model("Group", GroupSchema),
  Call: mongoose.model("Call", CallSchema),
};
