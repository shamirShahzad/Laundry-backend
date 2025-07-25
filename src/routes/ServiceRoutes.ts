import express from "express";
import serviceController from "../controller/ServiceController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const serviceRouter = express.Router();

serviceRouter.post("/create", isAuthenticated, serviceController.createService);
serviceRouter.get("/", isAuthenticated, serviceController.getServices);
serviceRouter.post(
  "/update/:id",
  isAuthenticated,
  serviceController.updateService
);
serviceRouter.post(
  "/delete/:id",
  isAuthenticated,
  serviceController.deleteService
);

export default serviceRouter;
