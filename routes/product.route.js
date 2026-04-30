import express from "express";
import {
  saveProductController,
  updateProductController,
  deleteProductController,
  getProductController,
  getProductSupplierController,
} from "../controllers/index.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";

const productRouter = express.Router();

productRouter.post("/", authenticate, saveProductController);
productRouter.put(
  "/:id",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR", "PROCUREMENT", "SUPPLIER"),
  updateProductController,
);
productRouter.delete(
  "/:id",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR", "PROCUREMENT", "SUPPLIER"),
  deleteProductController,
);
productRouter.get("/", authenticate, getProductController);
productRouter.get("/supplier", authenticate, getProductSupplierController);

export default productRouter;
