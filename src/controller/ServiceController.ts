import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { Response, NextFunction } from "express";
import { Service } from "../models/service.model";
import { ERRORS, STATUS_CODES } from "../util/enums";
const { NOT_FOUND, BAD_REQUEST, SUCCESS_CREATED } = STATUS_CODES;
const { ERROR_NOT_FOUND } = ERRORS;
import z, { ZodError } from "zod";
import { createService } from "../lib/user/db/service_db_functions";

const serviceController = {
  createService: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    let newServiceTup: z.infer<typeof Service>;
    try {
      const serviceTup = req.body;
      serviceTup.created_at = new Date();
      serviceTup.updated_at = null;
      newServiceTup = Service.parse(serviceTup);

      const createServiceTup = await createService(newServiceTup);
      if (createServiceTup.success == false) {
        if (createServiceTup.errorMessage === ERROR_NOT_FOUND) {
          res.status(NOT_FOUND);
          return next(new Error(ERROR_NOT_FOUND));
        }
        res.status(BAD_REQUEST);
        return next(new Error(createServiceTup.error));
      }
      res.status(SUCCESS_CREATED);
      return res.json({
        success: true,
        statusCode: SUCCESS_CREATED,
        message: "Service created successfully",
        data: createServiceTup.data,
      });
    } catch (error: any) {
      return next(error);
    }
  },
  getServices: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {},
  updateService: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {},
  deleteService: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {},
};

export default serviceController;
