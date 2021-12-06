import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { IProfile } from "../models/profile.model";
import {
  createProfile,
  getProfiles,
  editProfileById,
  deleteProfileById,
} from "../functions/profile.functions";

/**
 * Create a new profile and then send back the data of that
 * profile to the user who created it
 *
 * @route POST /api/profiles/
 */

export const newProfileController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { name, creds }: IProfile = req.body;
    if (name && creds) {
      const profile = await createProfile({ name, creds }, req.user);
      res.json(profile);
    } else {
      res.status(400);
      throw new Error("Bad request: Name and Creds are required fields");
    }
  }
);

/**
 * Get all the stored profiles
 *
 * @route GET /api/profiles
 */

export const indexProfilesController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const profiles = await getProfiles(req.user);
    res.json(profiles);
  }
);

/**
 * Find a profile by ID and then return the data back
 *
 * @route PATCH /api/profiles/:id
 */

export const editProfilesController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const profileEdited = await editProfileById(id, req.body, req.user);
    res.json(profileEdited);
  }
);

/**
 * Find a profile by ID and delete it
 *
 * @route DELETE /api/profiles/:id
 */

export const deleteProfileController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const profileDeleted = await deleteProfileById(id, req.user);
    res.json(profileDeleted);
  }
);
