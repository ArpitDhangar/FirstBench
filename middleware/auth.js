import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Not authenticated, please log in", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user || !user.isActive) {
      return next(new ErrorHandler("Account is deactivated", 403));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ErrorHandler("Invalid token, please log in again", 401));
  }
};
