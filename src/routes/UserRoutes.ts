import express, { Router } from "express";
import userController from "../controller/UserController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get("/me", isAuthenticated, userController.user);
userRouter.post("/logout", isAuthenticated, userController.logout);

export default userRouter;
