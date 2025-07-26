import z, { success } from "zod";
import { Item, ItemUpdate } from "../models/item.model";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { Response, NextFunction } from "express";
import {
  createItem,
  deleteItem,
  getAllItems,
  getItemById,
  updateItem,
} from "../lib/user/db/item_db_functions";
import { STATUS_CODES, ERRORS } from "../util/enums";
import { fillEmptyObject } from "../util/utilFunctions";
const { SUCCESS, NOT_FOUND, SUCCESS_CREATED, BAD_REQUEST } = STATUS_CODES;
const { ERROR_NOT_FOUND, ERROR_BAD_REQUEST } = ERRORS;

const itemController = {
  getItems: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.query;
    try {
      if (id) {
        const itemTup = await getItemById(id.toString());
        if (itemTup.success == false) {
          res.status(
            itemTup.errorMessage == ERROR_NOT_FOUND ? NOT_FOUND : BAD_REQUEST
          );
          return next(itemTup.error);
        }
        return res.status(SUCCESS).json({
          success: true,
          statusCode: SUCCESS,
          message: "Item fetched successfully",
          data: itemTup.data,
        });
      }
      const itemsTup = await getAllItems();
      if (itemsTup.success == false) {
        res.status(
          itemsTup.errorMessage == ERROR_NOT_FOUND ? NOT_FOUND : BAD_REQUEST
        );
        return next(itemsTup.error);
      }
      return res.status(SUCCESS).json({
        success: true,
        statusCode: SUCCESS,
        message: "Items fetched successfully",
        data: itemsTup.data,
      });
    } catch (error: any) {
      return next(error);
    }
  },
  createItem: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    let newItem: z.infer<typeof Item>;
    try {
      const myItem = req.body;
      myItem.created_at = new Date();
      myItem.updated_at = null;
      newItem = Item.parse(myItem);
      const createItemTup = await createItem(newItem);
      if (createItemTup.success == false) {
        res.status(
          createItemTup.errorMessage == ERROR_NOT_FOUND
            ? NOT_FOUND
            : BAD_REQUEST
        );
        return next(createItemTup.error);
      }
      res.status(SUCCESS_CREATED);
      return res.json({
        success: true,
        statusCode: SUCCESS_CREATED,
        message: "Item created successfully",
        data: createItemTup.data,
      });
    } catch (error: any) {
      return next(error);
    }
  },
  updateItem: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    if (id == undefined || id == null) {
      return next(new Error(ERROR_NOT_FOUND));
    }
    let item: z.infer<typeof ItemUpdate>;
    try {
      const oldTup = await getItemById(id.toString());
      if (oldTup.success == false) {
        res.status(
          oldTup.errorMessage == ERROR_NOT_FOUND ? NOT_FOUND : BAD_REQUEST
        );
        return next(oldTup.error);
      }
      const updateTup = req.body;
      const filledUpdateTup = fillEmptyObject(updateTup, oldTup.data);
      const item = ItemUpdate.parse(filledUpdateTup);
      const updateItemTup = await updateItem(item);
      if (updateItemTup?.success == false) {
        res.status(
          updateItemTup.errorMessage == ERROR_NOT_FOUND
            ? NOT_FOUND
            : BAD_REQUEST
        );
        return next(updateItemTup.error);
      }
      return res.status(SUCCESS).json({
        success: true,
        statusCode: SUCCESS,
        message: "Item updated successfully",
        data: updateItemTup.data,
      });
    } catch (error: any) {
      return next(error);
    }
  },
  deleteItem: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    if (id == undefined || id == null) {
      return next(new Error(ERROR_NOT_FOUND));
    }
    try {
      const result = await deleteItem(id.toString());
      if (result.success == false) {
        res.status(
          result.errorMessage == ERROR_NOT_FOUND ? NOT_FOUND : BAD_REQUEST
        );
      }
      return res.status(SUCCESS).json({
        success: true,
        statusCode: SUCCESS,
        message: "Item deleted successfully",
      });
    } catch (error: any) {
      return next(error);
    }
  },
};

export default itemController;
