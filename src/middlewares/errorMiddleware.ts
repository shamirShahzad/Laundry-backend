import { Request, Response, NextFunction } from "express";
const errorMiddleWare = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //console.log(err);
  res.json({
    status: res.status,
    message: err.message,
    success: false,
    stack: err.stack?.toString() || "No stack trace",
  });
};

export default errorMiddleWare;
