import express from 'express';
import userRouter from './routes/user.js'
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.js";
import { User } from './models/user.js';
import bcrypt from 'bcrypt';

export const app = express();

config({
    path: "./data/config.env",
  });

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", userRouter);

app.get('/', (req, res) => {
    res.send("Nice Work Arpit!")
})

const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin';

    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      admin = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        phoneNumber: '1234567890',
      });

      await admin.save();
      console.log('Default admin created');
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

createDefaultAdmin();

app.use(errorMiddleware);

// Catch-all for invalid routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});