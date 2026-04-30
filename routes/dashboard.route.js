import express from "express";
import { getDashboardController } from "../controllers/dashboard.controller.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";

const dashboardRouter = express.Router();

dashboardRouter.get(
  "/",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR", "PROCUREMENT"),
  getDashboardController,
);

export default dashboardRouter;
