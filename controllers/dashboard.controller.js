import { getDashboardStatsSrv } from "../services/dashboard.service.js";
import Success from "../utils/success.js";

export const getDashboardController = async (req, res) => {
  try {
    const stats = await getDashboardStatsSrv();
    res.json(Success(stats, "Dashboard stats fetched successfully."));
  } catch (err) {
    res.status(err.status).json(err.message);
  }
};
