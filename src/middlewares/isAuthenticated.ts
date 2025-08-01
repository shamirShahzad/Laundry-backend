import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getUserById } from "../lib/user/db/user_db_functions";
import { STATUS_CODES } from "../util/enums";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import { NOT_FOUND_ERROR, UNAUTHORIZED_ERROR } from "../util/Errors";
const { UNAUTHORIZED, NOT_FOUND } = STATUS_CODES;

export const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.token) {
    res.status(UNAUTHORIZED);
    return next(UNAUTHORIZED_ERROR);
  }
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET!) as {
    id: string;
  };

  const user = await getUserById(decoded.id);
  if (user.success == false) {
    res.status(NOT_FOUND);
    return next(NOT_FOUND_ERROR);
  }
  req.user = user.data;
  return next();
};
