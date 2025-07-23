import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { Response, NextFunction } from "express";
import { Customer } from "../models/customer.model";
import z from "zod";
import { createCustomer } from "../lib/user/db/customer_db_functions";
import { STATUS_CODES } from "../util/enums";
const { BAD_REQUEST, SUCCESS_CREATED } = STATUS_CODES;
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
};

export default customerController;
