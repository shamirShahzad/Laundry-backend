import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { Response, NextFunction } from "express";
import { Service, ServiceUpdate } from "../models/service.model";
import { ERRORS, STATUS_CODES } from "../util/enums";
const { NOT_FOUND, BAD_REQUEST, SUCCESS_CREATED, SUCCESS } = STATUS_CODES;
const { ERROR_NOT_FOUND, ERROR_BAD_REQUEST } = ERRORS;
import z, { ZodError } from "zod";
import {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  updateService,
} from "../lib/user/db/service_db_functions";
import { fillEmptyObject } from "../util/utilFunctions";

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
  ) => {
    const { id } = req.query;
    if (id) {
      try {
        const serviceTup = await getServiceById(id.toString());
        if (serviceTup.success == false) {
          if (serviceTup.errorMessage === ERROR_NOT_FOUND) {
            res.status(NOT_FOUND);
            res.json({
              success: false,
              statusCode: NOT_FOUND,
              message: "Service not found.",
              data: {},
            });
          }
          res.status(BAD_REQUEST);
          return next(serviceTup.error);
        }
        res.status(SUCCESS);
        res.json({
          success: true,
          statusCode: SUCCESS,
          message: "Service fetched successfully",
          data: serviceTup.data,
        });
      } catch (error: any) {
        return next(error);
      }
    }
    try {
      const servicesTup = await getAllServices();
      if (servicesTup.success == false) {
        if (servicesTup.errorMessage === ERROR_NOT_FOUND) {
          res.status(NOT_FOUND);
          res.json({
            success: false,
            statusCode: NOT_FOUND,
            message: "Service Not Found.",
            data: [],
          });
        }
        res.status(BAD_REQUEST);
        return next(servicesTup.error);
      }
      res.status(SUCCESS);
      res.json({
        success: true,
        statusCode: SUCCESS,
        message: "Services fetched successfully.",
        data: servicesTup.data,
      });
    } catch (error: any) {
      return next(error);
    }
  },
  updateService: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    if (id === undefined || id === null) {
      return next(new Error(ERROR_BAD_REQUEST));
    }
    let service: z.infer<typeof ServiceUpdate>;
    try {
      const oldTup = await getServiceById(id.toString());
      if (oldTup.success == false) {
        if (oldTup.errorMessage == ERROR_NOT_FOUND) {
          res.status(NOT_FOUND);
          return next(new Error("Service not found"));
        }
        res.status(BAD_REQUEST);
        return next(oldTup.error);
      }
      const updateTup = req.body;
      const filledUpdateTup = fillEmptyObject(updateTup, oldTup.data);
      service = ServiceUpdate.parse(filledUpdateTup);
      const updatedServiceTup = await updateService(service);
      if (updatedServiceTup?.success == false) {
        res.status(BAD_REQUEST);
        return next(updatedServiceTup.error);
      }
      res.status(SUCCESS);
      return res.json({
        success: true,
        statusCode: SUCCESS,
        message: "Service updated successfully",
        data: updatedServiceTup.data,
      });
    } catch (error: any) {
      return next(error);
    }
  },
  deleteService: async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    if (id === undefined || id === null) {
      return next(new Error(ERROR_NOT_FOUND));
    }
    try {
      const deleteTup = await deleteService(id.toString());
      if (deleteTup.success == false) {
        if (deleteTup.errorMessage == ERROR_NOT_FOUND) {
          res.status(NOT_FOUND);
          return res.json({
            success: NOT_FOUND,
            message: "Service not found.",
          });
        }
        res.status(BAD_REQUEST);
        return next(deleteTup.error);
      }
      return res.status(SUCCESS).json({
        success: true,
        statusCode: SUCCESS,
        message: "Service deleted successfully",
      });
    } catch (error: any) {
      return next(error);
    }
  },
};

export default serviceController;
