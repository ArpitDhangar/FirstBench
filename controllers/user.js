import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middleware/error.js";

// Super Admin Login
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || user.role !== "admin")
      return next(new ErrorHandler("Invalid Admin Email or Password", 404));

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return next(new ErrorHandler("Invalid Admin Email or Password", 404));

    sendCookie(user, res, `Welcome back, Admin ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};

// Regular User Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Invalid Email or Password", 404));

    if (!user.isActive) {
      return next(new ErrorHandler("Your account is inactive. Please contact support or wait for reactivation.", 403));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison result:", isMatch);

    if (!isMatch) return next(new ErrorHandler("Invalid Email or Password", 404));

    sendCookie(user, res, `Welcome back, ${user.name}`, 200);
  } catch (error) {
    next(error);
  }
};



// Register User
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("User Already Exists", 404));

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({ name, email, password: hashedPassword, phoneNumber });

    sendCookie(user, res, "Registered Successfully", 201);
  } catch (error) {
    next(error);
  }
};

// Update User Profile
export const update = async (req, res, next) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Get My Profile (for regular user)
export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

// Admin - Get All Users (Super Admin Access)
export const getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return next(new ErrorHandler("Access Denied", 403));

    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Logout User
export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      user: req.user,
    });
};

// Deactivate User Account (Super Admin or User)
export const deactivateAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (req.user.role === "admin") {
      const { targetUserId } = req.body;
      const targetUser = await User.findById(targetUserId);

      if (!targetUser) return next(new ErrorHandler("User not found", 404));

      targetUser.isActive = false;
      await targetUser.save();

      setTimeout(async () => {
        targetUser.isActive = true;
        await targetUser.save();
        console.log(`Account of user ${targetUser.email} reactivated`);
      }, 60000);

      return res.status(200).json({
        success: true,
        message: `Account for ${targetUser.email} has been deactivated successfully. It will reactivate in 1 minute.`,
      });
    }

    const user = await User.findById(userId);

    if (!user) return next(new ErrorHandler("User not found", 404));

    user.isActive = false;
    await user.save();

    setTimeout(async () => {
      user.isActive = true;
      await user.save();
      console.log(`Account of user ${user.email} reactivated`);
    }, 60000);

    res.status(200).cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    }).json({
      success: true,
      message: "Your account has been deactivated successfully. It will reactivate in 1 minute.",
    });
  } catch (error) {
    next(error);
  }
};


