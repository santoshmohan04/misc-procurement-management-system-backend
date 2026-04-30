import express from "express";
import {
  saveOrderNewController,
  updateNewOrderController,
  deleteNewOrderController,
  getOrdersNewController,
  getOrdersNewManagerController,
  getOrdersNewSupplierController,
  getSingleOrderController,
  bulkUpdateOrdersController,
} from "../controllers/index.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";

const orderNewRouter = express.Router();

orderNewRouter.post("/", authenticate, saveOrderNewController);
orderNewRouter.post(
  "/bulk-update",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR", "PROCUREMENT"),
  bulkUpdateOrdersController,
);
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
orderNewRouter.get("/single/:id", authenticate, getSingleOrderController);
orderNewRouter.get(
  "/",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR", "PROCUREMENT"),
  getOrdersNewController,
);
orderNewRouter.get("/manager", authenticate, getOrdersNewManagerController);
orderNewRouter.get("/supplier", authenticate, getOrdersNewSupplierController);

export default orderNewRouter;
