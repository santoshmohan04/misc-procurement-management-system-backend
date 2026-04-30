import { getDashboardStats } from "../repository/dashboard.repository.js";
import AppError from "../utils/appError.js";

export const getDashboardStatsSrv = async () => {
  try {
    const stats = await getDashboardStats();
    return Promise.resolve(stats);
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
};
