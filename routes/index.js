import express from "express";
import userRouter from "./user.route.js";
import supplierRouter from "./supplier.route.js";
import orderRouter from "./order.route.js";
import orderNewRouter from "./delivery.route.js";
import deliveryAdviceRouter from "./deliveryAdvice.route.js";
import productRouter from "./product.route.js";
import paymentRouter from "./payment.route.js";
import dashboardRouter from "./dashboard.route.js";
import {
  forgotPasswordController,
  resetPasswordController,
} from "../controllers/user.controller.js";

const apiRouter = express.Router();
apiRouter.post("/forgot-password", forgotPasswordController);
apiRouter.post("/reset-password", resetPasswordController);
apiRouter.use("/user", userRouter);
apiRouter.use("/supplier", supplierRouter);
apiRouter.use("/order", orderRouter);
apiRouter.use("/orderNew", orderNewRouter);
apiRouter.use("/deliveryAdvice", deliveryAdviceRouter);
apiRouter.use("/product", productRouter);
apiRouter.use("/payment", paymentRouter);
apiRouter.use("/dashboard", dashboardRouter);

export default apiRouter;
