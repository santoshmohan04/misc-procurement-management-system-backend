import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import {
  saveUser,
  loginUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../repository/index.js";
import AppError from "../utils/appError.js";

export const save = async (data) => {
  try {
    const exUser = await getUser({ email: data?.email });
    if (exUser) {
      throw new AppError("User already exists.", 400);
    } else {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(data.password, salt);
      data.password = hash; // eslint-disable-line no-param-reassign
    }
    await saveUser(data);
    return Promise.resolve("Successfully registered.");
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
};

export const login = async (data) => {
  const { email, password } = data;
  try {
    const user = await loginUser(email);
    if (!user) {
      throw new AppError("User does not exist.", 404);
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new AppError("Password is incorrect.", 400);
      } else {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        const refreshToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
          { expiresIn: "7d" },
        );
        await updateUser(user._id, { refreshToken });
        return Promise.resolve({ token, refreshToken });
      }
    }
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
};

export const getUsersSrv = async () => {
  try {
    const users = await getUsers();
    return Promise.resolve(users);
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
};

export const updateUserSrv = async (id, data) => {
  try {
    const user = await updateUser(id, data);
    return Promise.resolve(user);
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
};

export const deleteUserSrv = async (id) => {
  try {
    const user = await deleteUser(id);
    return Promise.resolve(user);
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
};

export const refreshTokenSrv = async (refreshToken) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    );
    const storedUser = await getUser({ _id: decoded._id });
    if (!storedUser) {
      throw new AppError("User not found.", 404);
    }
    // getUser selects -password; we need refreshToken field so fetch via loginUser by email
    const userWithToken = await loginUser(storedUser.email);
    if (!userWithToken || userWithToken.refreshToken !== refreshToken) {
      throw new AppError("Invalid refresh token.", 401);
    }
    const token = jwt.sign({ _id: storedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return Promise.resolve({ token });
  } catch (err) {
    if (err.status) throw err;
    throw new AppError("Invalid or expired refresh token.", 401);
  }
};

export const forgotPasswordSrv = async (email) => {
  try {
    const user = await loginUser(email);
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await updateUser(user._id, {
      resetPasswordToken: passwordResetToken,
      resetPasswordExpires: passwordResetExpires,
    });

    const resetURL = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "noreply@example.com",
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Please click on the link to reset your password: \n\n ${resetURL}`,
    });

    return Promise.resolve("Password reset link sent to your email.");
  } catch (err) {
    throw new AppError(err.message, err.status || 500);
  }
};

export const resetPasswordSrv = async (token, newPassword) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await getUser({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError("Token is invalid or has expired.", 400);
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(newPassword, salt);

    await updateUser(user._id, {
      password: hash,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    return Promise.resolve("Password updated successfully.");
  } catch (err) {
    throw new AppError(err.message, err.status || 500);
  }
};
