import express from "express";
import userController from "../controller/UserController";

const userRouter = express.Router();

userRouter.get("/register", userController.register);

userRouter.post("/login", userController.login);

export default userRouter;
