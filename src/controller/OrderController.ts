import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { Response, NextFunction } from "express";
import { STATUS_CODES, ERRORS } from "../util/enums";
const { BAD_REQUEST, SUCCESS_CREATED, SUCCESS, NOT_FOUND } = STATUS_CODES;
const { MSG_ERROR_NOT_FOUND } = ERRORS;
import { Order, OrderUpdate } from "../models/order.model";
import { fillEmptyObject } from "../util/utilFunctions";
import {
  getAllOrders,
  createOrder,
  getOrdersForTable,
} from "../lib/user/db/order_db_functions";

export const orderController = {
  getAllOrders: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await getAllOrders(req.query);
      if (result.success == false) {
        res.status(
          result.errorMessage == MSG_ERROR_NOT_FOUND ? NOT_FOUND : BAD_REQUEST
        );
        return next(result.error);
      }
      return res.status(SUCCESS).json({
        success: true,
        statusCode: SUCCESS,
        message: "Orders fetched successfully",
        data: result.data,
      });
    } catch (error: any) {
      return next(error);
    }
  },
  createOrder: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const body = req.body;
    body.cust_id = Number(body.cust_id);
    body.paid_amount = Number(body.paid_amount);
    try {
      const newOrderTup = Order.parse(body);
      const createOrderTup = await createOrder(newOrderTup);
      if (createOrderTup.success === false) {
        res.status(
          createOrderTup.errorMessage == MSG_ERROR_NOT_FOUND
            ? NOT_FOUND
            : BAD_REQUEST
        );
        return next(createOrderTup.error);
      }
      res.status(SUCCESS_CREATED);
      return res.json({
        success: true,
        statusCode: SUCCESS_CREATED,
        message: "Order created successfully",
        data: createOrderTup?.data,
      });
    } catch (error: any) {
      return next(error);
    }
  },
  updateOrder: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {},
  getOrdersForTableRows: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await getOrdersForTable(req.query);
      if (result.success == false) {
        res.status(
          result.errorMessage == MSG_ERROR_NOT_FOUND ? NOT_FOUND : BAD_REQUEST
        );
        return next(result.error);
      }
      return res.status(SUCCESS).json({
        success: true,
        statusCode: SUCCESS,
        message: "Orders fetched successfully",
        data: result.data,
      });
    } catch (error: any) {
      if (error instanceof Error) {
        return next(error);
      }
    }
  },
};
