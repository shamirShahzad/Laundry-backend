import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
const errorMiddleWare = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const zodErr = err as ZodError<any>;
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: zodErr.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }
  res.json({
    status: res.status,
    message: err.message,
    success: false,
    stack: err.stack?.toString() || "No stack trace",
    data: {},
  });
};

export default errorMiddleWare;
