/* eslint-disable no-console */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database.");

    const email = "admin@test.com";
    const password = "password123";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`User already exists with email: ${email}`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      name: "Test Admin",
      nic: "999999999V",
      email,
      mobile: "0771234567",
      department: "PROCUREMENT",
      password: hashedPassword,
      role: "SITE_MANAGER",
      siteName: "Head Office",
    });

    console.log("Test user created successfully!");
    console.log(`Email: ${email} | Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedUser();
