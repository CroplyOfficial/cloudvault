import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getSetupDetails } from "../utils/app.util";

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
 * Onboarding controller for the user, setup the username and password
 * and create a keypair for the said user and initiate the setup.
 *
 * @async
 * @route POST /api/app
 */

export const cloudVaultOnboarding = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const cloudVaultConfig = await getSetupDetails();
    res.json(cloudVaultConfig);
  }
);
