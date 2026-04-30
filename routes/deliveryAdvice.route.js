import express from "express";
import {
  saveDeliveryAdviceController,
  updateDeliveryAdviceController,
  deleteDeliveryAdviceController,
  getAllDeliveryAdviceController,
  getDeliveryAdviceforManagerController,
  getDeliveryAdviceforSupplierController,
} from "../controllers/index.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";

const deliveryAdviceRouter = express.Router();

deliveryAdviceRouter.post("/", authenticate, saveDeliveryAdviceController);
deliveryAdviceRouter.put(
  "/:id",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR", "PROCUREMENT", "SUPPLIER"),
  updateDeliveryAdviceController,
);
deliveryAdviceRouter.delete(
  "/:id",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR", "PROCUREMENT"),
  deleteDeliveryAdviceController,
);
deliveryAdviceRouter.get(
  "/",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR", "PROCUREMENT", "SUPPLIER"),
  getAllDeliveryAdviceController,
);
deliveryAdviceRouter.get(
  "/manager",
  authenticate,
  getDeliveryAdviceforManagerController,
);
deliveryAdviceRouter.get(
  "/supplier",
  authenticate,
  getDeliveryAdviceforSupplierController,
);

export default deliveryAdviceRouter;
