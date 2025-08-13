import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { orderController } from "../controller/OrderController";

export const orderRouter = express.Router();

orderRouter.get("/", isAuthenticated, orderController.getAllOrders);

orderRouter.get(
  "/table",
  isAuthenticated,
  orderController.getOrdersForTableRows
);

orderRouter.post("/create", isAuthenticated, orderController.createOrder);

orderRouter.post("/update/:id", isAuthenticated, orderController.updateOrder);
