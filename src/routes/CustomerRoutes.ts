import express from "express";
import customerController from "../controller/CustomerController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const customerRouter = express.Router();
//Create New Customer Details
customerRouter.post(
  "/create",
  isAuthenticated,
  customerController.createCustomer
);
// Get all Customers or one depending on the query
customerRouter.get("/", isAuthenticated, customerController.getCustomers);

//Update Customer Details
customerRouter.post(
  "/update/:id",
  isAuthenticated,
  customerController.updateCustomer
);

customerRouter.post(
  "/delete/:id",
  isAuthenticated,
  customerController.deleteCustomer
);

export default customerRouter;
