import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const users = [
  {
    username: "hossam",
    password: process.env.ADMIN_PASSWORD,
    role: "admin",
  },
  {
    username: "mohammed",
    password: process.env.MOHAMMED_PASSWORD,
    role: "player",
  },
  {
    username: "abdulrahman",
    password: process.env.ABDULRAHMAN_PASSWORD,
    role: "player",
  },
];
const seedUsers = async () => {
  try {
    await connectDB();

    for (const userData of users) {
      if (!userData.password) {
        throw new Error(`Missing password for user: ${userData.username}`);
      }

      const existingUser = await User.findOne({
        username: userData.username,
      });

      if (existingUser) {
        console.log(`User already exists: ${userData.username}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12);

      await User.create({
        ...userData,
        password: hashedPassword,
      });

      console.log(`User created: ${userData.username}`);
    }
  } catch (error) {
    console.error("Seeding users failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedUsers();
