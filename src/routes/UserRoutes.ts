import express from "express";
import userController from "../controller/UserController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const userRouter = express.Router();

userRouter.post("/register", userController.register);

userRouter.post("/login", userController.login);

userRouter.get("/dashboard", isAuthenticated, userController.dashboard);

export default userRouter;
