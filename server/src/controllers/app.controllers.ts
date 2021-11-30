import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

const pingController = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    message: "pong",
  });
});

export { pingController };
