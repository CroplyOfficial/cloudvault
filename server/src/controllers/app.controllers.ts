import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getIPDetails } from "../utils/app.util";

/**
 * A ping route to test if a server is actually running or not
 *
 * @route GET /api/app/ping
 * @returns {String} pong
 */

export const pingController = asyncHandler(
  async (req: Request, res: Response) => {
    res.json({
      message: "pong",
    });
  }
);

/**
 * Get the IP details of the server and then send them as an object
 *
 * @route GET /api/app
 */

export const getIPController = asyncHandler(
  async (req: Request, res: Response) => {
    const ipDetails = await getIPDetails().catch((error) => {
      console.error(error);
      throw new Error("unable to resolve IP Details");
    });
    res.json(ipDetails);
  }
);
