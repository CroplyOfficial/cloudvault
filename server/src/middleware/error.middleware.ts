import { Request, Response, NextFunction } from "express";

/**
 * Pass the backend errors to the frontend in form of a message
 * JSON { message: message.err }
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
  });
};

export { errorHandler };
