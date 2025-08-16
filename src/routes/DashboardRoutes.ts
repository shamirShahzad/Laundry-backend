import express from "express";
import { dashboardController } from "../controller/DasboardController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
export const dashboardRouter = express.Router();

dashboardRouter.get("/charts", isAuthenticated, dashboardController.getCharts);
dashboardRouter.get(
  "/orders/latest",
  isAuthenticated,
  dashboardController.getLatestOrders
);
dashboardRouter.get(
  "/customers/latest",
  isAuthenticated,
  dashboardController.getLatestCustomers
);

export default dashboardRouter;
