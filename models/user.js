import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      minlength: 10,
      maxlength: 15,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    reactivationTime: {
      type: Date, 
      default: null,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", schema);
