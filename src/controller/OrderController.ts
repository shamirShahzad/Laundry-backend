import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { Response, NextFunction } from "express";
import { STATUS_CODES, ERRORS, PAYMENT_STATUS } from "../util/enums";
const { BAD_REQUEST, SUCCESS_CREATED, SUCCESS, NOT_FOUND } = STATUS_CODES;
const { MSG_ERROR_NOT_FOUND } = ERRORS;
import { Order, OrderUpdate, OrderUpdateStatus } from "../models/order.model";
import {
  getAllOrders,
  createOrder,
  getOrdersForTable,
  UpdateOrderStatus,
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

      if (newOrderTup.paid_amount > 0) {
        if (newOrderTup.paid_amount >= newOrderTup.total) {
          newOrderTup.payment_status = PAYMENT_STATUS.PAID;
        } else {
          newOrderTup.payment_status = PAYMENT_STATUS.PARTIAL;
        }
      } else {
        newOrderTup.payment_status = PAYMENT_STATUS.UNPAID;
      }
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
  updateOrderStatus: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const body = req.body;
    const { id } = req.params;
    try {
      const newOrderTup = OrderUpdateStatus.parse(body);
      const updateOrderTup = await UpdateOrderStatus(newOrderTup, id);
      if (updateOrderTup.success == false) {
        res.status(
          updateOrderTup.errorMessage == MSG_ERROR_NOT_FOUND
            ? NOT_FOUND
            : BAD_REQUEST
        );
        return next(updateOrderTup.error);
      }
      res.status(SUCCESS);
      return res.json({
        success: true,
        statusCode: SUCCESS,
        message: "Order status updated successfully",
        data: updateOrderTup?.data,
      });
    } catch (error: any) {
      return next(error);
    }
  },
};
