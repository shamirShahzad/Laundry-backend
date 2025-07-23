import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { Response, NextFunction } from "express";
import { Customer } from "../models/customer.model";
import z from "zod";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerByPhone,
} from "../lib/user/db/customer_db_functions";
import { STATUS_CODES, ERRORS } from "../util/enums";
const { BAD_REQUEST, SUCCESS_CREATED, SUCCESS, NOT_FOUND } = STATUS_CODES;
const { ERROR_NOT_FOUND } = ERRORS;
const customerController = {
  createCustomer: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    let newCustomer: z.infer<typeof Customer>;
    try {
      const myCustomer = req.body;
      myCustomer.created_at = new Date();
      myCustomer.updated_at = null;
      newCustomer = Customer.parse(myCustomer);
    } catch (error: any) {
      return next(new Error(error.message));
    }
    const createCustomerTup = await createCustomer(newCustomer);
    if (createCustomerTup.success == false) {
      res.status(BAD_REQUEST);
      return next(new Error(createCustomerTup.error));
    }
    res.status(SUCCESS_CREATED);
    return res.json({
      success: true,
      statusCode: SUCCESS_CREATED,
      message: "Customer created successfully",
      data: createCustomerTup.data,
    });
  },
  getCustomers: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, phone } = req.query;
      if (id) {
        try {
          const customerTup = await getCustomerById(Number(id));
          if (customerTup.success == false) {
            if (customerTup.errorMessage == ERROR_NOT_FOUND) {
              res.status(NOT_FOUND);
              return next(new Error("Customer not found"));
            }
            res.status(BAD_REQUEST);
            return next(new Error(customerTup.error));
          }
          res.status(SUCCESS);
          return res.json({
            success: true,
            statusCode: SUCCESS,
            message: "Customer fetched successfully",
            data: customerTup.data,
          });
        } catch (error: any) {
          return next(new Error(error));
        }
      } else if (phone) {
        try {
          const customerTup = await getCustomerByPhone(phone.toString());
          if (customerTup.success == false) {
            if (customerTup.errorMessage == ERROR_NOT_FOUND) {
              res.status(NOT_FOUND);
              return next(new Error("Customer not found"));
            }
            res.status(BAD_REQUEST);
            return next(new Error(customerTup.error));
          }
          res.status(SUCCESS);
          return res.json({
            success: true,
            statusCode: SUCCESS,
            message: "Customer fetched successfully",
            data: customerTup.data,
          });
        } catch (error: any) {
          return next(new Error(error));
        }
      }
      const result = await getAllCustomers();
      if (result.success == false) {
        if (result.errorMessage == ERROR_NOT_FOUND) {
          res.status(NOT_FOUND);
          return next(new Error("Customers not found"));
        }
        res.status(BAD_REQUEST);
        return next(new Error(result.error));
      }
      res.status(SUCCESS);
      return res.json({
        success: true,
        statusCode: SUCCESS,
        message: "Customers fetched successfully",
        data: result.data,
      });
    } catch (error: any) {
      return next(new Error(error));
    }
  },
};

export default customerController;
