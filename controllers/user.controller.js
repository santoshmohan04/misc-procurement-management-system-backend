import {
  save,
  login,
  getUsersSrv,
  updateUserSrv,
  deleteUserSrv,
  refreshTokenSrv,
  forgotPasswordSrv,
  resetPasswordSrv,
} from "../services/index.js";
import Success from "../utils/success.js";

export const saveUser = async (req, res) => {
  try {
    const user = await save(req.body);
    res.json(Success(user, "Successfully registered."));
  } catch (err) {
    res.status(err.status).json(err.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await login(req.body);
    res.json(Success(user, "Successfully logged in."));
  } catch (err) {
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export const viewProfile = async (req, res) => {
  try {
    res.json(Success(req.user, "View profile success."));
  } catch (err) {
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export const getUsersController = async (req, res) => {
  try {
    const users = await getUsersSrv();
    res.json(Success(users, "Successfully users fetched."));
  } catch (err) {
    res.status(err.status).json(err.message);
  }
};

export const updateUserController = async (req, res) => {
  try {
    const user = await updateUserSrv(req.params.id, req.body);
    res.json(Success(user, "Successfully user Updated."));
  } catch (err) {
    res.status(err.status).json(err.message);
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const user = await deleteUserSrv(req.params.id);
    res.json(Success(user, "Successfully user Deleted."));
  } catch (err) {
    res.status(err.status).json(err.message);
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json("refreshToken is required.");
    }
    const result = await refreshTokenSrv(refreshToken);
    return res.json(Success(result, "Token refreshed successfully."));
  } catch (err) {
    return res.status(err.status || 401).json(err.message);
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json("Email is required.");
    }
    const result = await forgotPasswordSrv(email);
    return res.json(Success(result, "Password reset link sent to your email."));
  } catch (err) {
    return res
      .status(err.status || 500)
      .json(err.message || "Internal Server Error");
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json("Token and new password are required.");
    }
    const result = await resetPasswordSrv(token, newPassword);
    return res.json(Success(result, "Password has been reset successfully."));
  } catch (err) {
    return res
      .status(err.status || 500)
      .json(err.message || "Internal Server Error");
  }
};
