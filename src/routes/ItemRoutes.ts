import express from "express";
import itemController from "../controller/ItemController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const itemRouter = express.Router();

itemRouter.get("/", isAuthenticated, itemController.getItems);
itemRouter.post("/create", isAuthenticated, itemController.createItem);
itemRouter.post("/update/:id", isAuthenticated, itemController.updateItem);
itemRouter.post("/delete/:id", isAuthenticated, itemController.deleteItem);

export default itemRouter;
