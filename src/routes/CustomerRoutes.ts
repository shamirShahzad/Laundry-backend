import express from "express";
import customerController from "../controller/CustomerController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const customerRouter = express.Router();

customerRouter.post(
  "/create",
  isAuthenticated,
  customerController.createCustomer
);

customerRouter.get("/", isAuthenticated, customerController.getCustomers);

export default customerRouter;
