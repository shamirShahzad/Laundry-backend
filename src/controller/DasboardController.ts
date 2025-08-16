import { NextFunction, Response } from "express";
import {
  getChartData,
  getLatestCustomers,
  getLatestOrders,
} from "../lib/user/db/dashboard_db_functions";

import { ERRORS, STATUS_CODES } from "../util/enums";
const { MSG_ERROR_NOT_FOUND } = ERRORS;

const { BAD_REQUEST, NOT_FOUND, SUCCESS } = STATUS_CODES;

export const dashboardController = {
  getCharts: async (req: any, res: Response, next: NextFunction) => {
    try {
      const response = await getChartData();
      if (response.success == false) {
        res.status(
          response.errorMessage == MSG_ERROR_NOT_FOUND ? NOT_FOUND : BAD_REQUEST
        );
        return next(response.error);
      }
      return res.status(SUCCESS).json({
        success: true,
        statusCode: SUCCESS,
        message: "Orders fetched successfully",
        data: response.data,
      });
    } catch (error) {
      return next(error);
    }
  },
  getLatestOrders: async (req: any, res: Response, next: NextFunction) => {
    try {
      const orderTup = await getLatestOrders();
      if (orderTup.success == false) {
        res.status(
          orderTup.errorMessage == MSG_ERROR_NOT_FOUND ? NOT_FOUND : BAD_REQUEST
        );
        return next(orderTup.error);
      }
      return res.status(SUCCESS).json({
        success: true,
        statusCode: SUCCESS,
        message: "Orders fetched successfully",
        data: orderTup.data,
      });
    } catch (error) {
      return next(error);
    }
  },
  getLatestCustomers: async (req: any, res: Response, next: NextFunction) => {
    try {
      const customersTup = await getLatestCustomers();
      if (customersTup.success == false) {
        res.status(
          customersTup.errorMessage == MSG_ERROR_NOT_FOUND
            ? NOT_FOUND
            : BAD_REQUEST
        );
        return next(customersTup.error);
      }
      return res.status(SUCCESS).json({
        success: true,
        statusCode: SUCCESS,
        message: "Customers fetched successfully",
        data: customersTup.data,
      });
    } catch (error) {
      return next(error);
    }
  },
};
