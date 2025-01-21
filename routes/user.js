import express from 'express';
import { login, register, update, getMyProfile, logout, deactivateAccount, adminLogin, getAllUsers } from '../controllers/user.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post("/users/login", login);
router.post("/users/register", register);
router.put("/users/update", isAuthenticated, update);
router.get("/users/me", isAuthenticated, getMyProfile);
router.post("/users/logout", isAuthenticated, logout);
router.put("/users/deactivate", isAuthenticated, deactivateAccount);

// Admin routes (only accessible by Super Admin)
router.post("/admin/login", adminLogin);
router.get("/admin/users", isAuthenticated, getAllUsers);

export default router;
