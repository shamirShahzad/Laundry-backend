import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { Response, NextFunction } from "express";
import { Customer, CustomerUpdate } from "../models/customer.model";
import z, { success } from "zod";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerByPhone,
  updateCustomer,
} from "../lib/user/db/customer_db_functions";
import { STATUS_CODES, ERRORS } from "../util/enums";
import { fillEmptyObject } from "../util/utilFunctions";
const { BAD_REQUEST, SUCCESS_CREATED, SUCCESS, NOT_FOUND, SUCCESS_NO_CONTENT } =
  STATUS_CODES;
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
      return next(error);
    }
    const createCustomerTup = await createCustomer(newCustomer);
    if (createCustomerTup.success == false) {
      res.status(BAD_REQUEST);
      return next(createCustomerTup.error);
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
            return next(customerTup.error);
          }
          res.status(SUCCESS);
          return res.json({
            success: true,
            statusCode: SUCCESS,
            message: "Customer fetched successfully",
            data: customerTup.data,
          });
        } catch (error: any) {
          return next(error);
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
            return next(customerTup.error);
          }
          res.status(SUCCESS);
          return res.json({
            success: true,
            statusCode: SUCCESS,
            message: "Customer fetched successfully",
            data: customerTup.data,
          });
        } catch (error: any) {
          return next(error);
        }
      }
      const result = await getAllCustomers();
      if (result.success == false) {
        if (result.errorMessage == ERROR_NOT_FOUND) {
          res.status(NOT_FOUND);
          return next(new Error("Customers not found"));
        }
        res.status(BAD_REQUEST);
        return next(result.error);
      }
      res.status(SUCCESS);
      return res.json({
        success: true,
        statusCode: SUCCESS,
        message: "Customers fetched successfully",
        data: result.data,
      });
    } catch (error: any) {
      return next(error);
    }
  },

  updateCustomer: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    let customer: z.infer<typeof CustomerUpdate>;
    const { id } = req.params;
    if (id === undefined || id === null) {
      return next(new Error(ERROR_NOT_FOUND));
    }

    try {
      const oldTup = await getCustomerById(Number(id));
      if (oldTup.success == false) {
        if (oldTup.errorMessage == ERROR_NOT_FOUND) {
          res.status(NOT_FOUND);
          return next(new Error("Customer not found"));
        }
        res.status(BAD_REQUEST);
        return next(oldTup.error);
      }
      const updateTup = req.body;
      const filledUpdateTup = fillEmptyObject(updateTup, oldTup.data);
      console.log("Update TUP", filledUpdateTup);
      customer = CustomerUpdate.parse(filledUpdateTup);
      const updateCustomerTup = await updateCustomer(Number(id), customer);
      if (updateCustomerTup?.success == false) {
        if (updateCustomerTup.errorMessage == ERROR_NOT_FOUND) {
          res.status(NOT_FOUND);
          return next(new Error("Customer not found"));
        }
        res.status(BAD_REQUEST);
        return next(updateCustomerTup.error);
      }
      res.status(SUCCESS);
      return res.json({
        success: true,
        statusCode: SUCCESS,
        message: "Customer updated successfully",
        data: updateCustomerTup.data,
      });
    } catch (error: any) {
      return next(error);
    }
  },

  deleteCustomer: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    if (id === undefined || id === null) {
      return next(new Error(ERROR_NOT_FOUND));
    }
    try {
      const result = await deleteCustomer(Number(id));
      if (result.success == false) {
        if (result.errorMessage == ERROR_NOT_FOUND) {
          res.status(NOT_FOUND);
          return next(new Error(ERROR_NOT_FOUND));
        }
        res.status(BAD_REQUEST);
        return next(result.error);
      }
      res.status(SUCCESS);
      return res.json({
        success: true,
        statusCode: SUCCESS,
        message: "Customer deleted successfully",
      });
    } catch (error: any) {
      res.status(BAD_REQUEST);
      return next(error);
    }
  },
};

export default customerController;
