import express from "express";
import { celebrate } from "celebrate";
import { SignupBodySchema, LoginBodySchema } from "../schema/user.schema.js";
import {
  saveUser,
  loginUser,
  viewProfile,
  getUsersController,
  updateUserController,
  deleteUserController,
} from "../controllers/index.js";
import { authenticate, authorizeRoles } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/", celebrate({ body: SignupBodySchema }), saveUser);
userRouter.post("/login", celebrate({ body: LoginBodySchema }), loginUser);
userRouter.get("/me", authenticate, viewProfile);
userRouter.get(
  "/",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR", "PROCUREMENT"),
  getUsersController,
);
userRouter.put("/:id", authenticate, updateUserController);
userRouter.delete(
  "/:id",
  authenticate,
  authorizeRoles("SITE_MANAGER", "SENIOR"),
  deleteUserController,
);

export default userRouter;
