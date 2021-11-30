import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { createUser, loginUser } from "../functions/user.functions";

/**
 * Create a new user account and then return the account and
 * the user's token
 *
 * @route POST /api/users
 * @returns {IUser}
 */

export const newUser = asyncHandler(async (req: Request, res: Response) => {
  interface IBody {
    username: string;
    password: string;
  }
  const { username, password }: IBody = req.body;
  if (username && password) {
    const user = await createUser(username, password);
    res.json(user);
  } else {
    res.status(400);
    throw new Error("Bad Request");
  }
});

/**
 * Issue token to a user attempting to login if the creds match
 *
 * @route POST /api/users/login
 * @returns {IUser}
 */

export const authorizeUser = asyncHandler(
  async (req: Request, res: Response) => {
    interface IBody {
      username: string;
      password: string;
    }
    const { username, password }: IBody = req.body;
    if (username && password) {
      const loginData = await loginUser(username, password);
      res.json(loginData);
    } else {
      throw new Error("Bad request");
    }
  }
);
