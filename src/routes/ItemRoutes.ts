import express from "express";
import itemController from "../controller/ItemController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { upload } from "../util/multerConfig";

const itemRouter = express.Router();

itemRouter.get("/", isAuthenticated, itemController.getItems);
itemRouter.post(
  "/create",
  isAuthenticated,
  upload.single("image"),
  itemController.createItem
);
itemRouter.post(
  "/update/:id",
  isAuthenticated,
  upload.single("image"),
  itemController.updateItem
);
itemRouter.post("/delete/:id", isAuthenticated, itemController.deleteItem);

export default itemRouter;
