import express from "express";
import {
  saveOrderNewController,
  updateNewOrderController,
  deleteNewOrderController,
  getOrdersNewController,
  getOrdersNewManagerController,
  getOrdersNewSupplierController,
  getSingleOrderController,
} from "../controllers/index.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";

const orderNewRouter = express.Router();

orderNewRouter.post("/", authenticate, saveOrderNewController);
orderNewRouter.put(
  "/:id",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR", "PROCUREMENT", "SUPPLIER"),
  updateNewOrderController,
);
orderNewRouter.delete(
  "/:id",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR", "PROCUREMENT"),
  deleteNewOrderController,
);
orderNewRouter.get("/single/:id", getSingleOrderController);
orderNewRouter.get("/", getOrdersNewController);
orderNewRouter.get("/manager", authenticate, getOrdersNewManagerController);
orderNewRouter.get("/supplier", authenticate, getOrdersNewSupplierController);

export default orderNewRouter;
