import express from "express";
import {
  savePaymentController,
  getPaymentController,
  getPaymentByIdController,
  updatePaymentController,
  deletePaymentController,
  getPaymentByManagerIdController,
} from "../controllers/index.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/", authenticate, savePaymentController);
paymentRouter.put(
  "/:id",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR", "PROCUREMENT"),
  updatePaymentController,
);
paymentRouter.delete(
  "/:id",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR", "PROCUREMENT"),
  deletePaymentController,
);
paymentRouter.get("/manager", authenticate, getPaymentByManagerIdController);
paymentRouter.get(
  "/",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR", "PROCUREMENT"),
  getPaymentController,
);
paymentRouter.get(
  "/:id",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR", "PROCUREMENT"),
  getPaymentByIdController,
);

export default paymentRouter;
