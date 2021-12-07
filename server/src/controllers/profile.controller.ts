import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ICredConfig, IProfile } from "../models/profile.model";
import {
  createProfile,
  getProfiles,
  editProfileById,
  deleteProfileById,
  handleValidationRequest,
} from "../functions/profile.functions";
import { resourceLimits } from "worker_threads";

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

/**
 * Validation of the request to verify a profile
 *
 * @route /api/profiles/validate/:id
 */

export const validateProfileController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    let addr;
    const addrRaw =
      (req.headers["x-forwarded-for"] as string) ||
      (req.socket.remoteAddress as string);
    if (!addrRaw) throw new Error("can't determine client");

    // ::ffff: is sunnet prefix for ipv4 addresses
    // we yoink that out and then get the interface suffix
    if (addrRaw.includes("::ffff:")) {
      addr = addrRaw.split("::ffff:")[1];
    } else {
      addr = addrRaw;
    }
    const result = await handleValidationRequest(addr, req.params.id);
    const creds: any = [];
    result.creds.forEach((cred) => {
      const credentialSubjectKeys: string[] = Object.keys(
        // @ts-ignore
        cred.vc.credentialSubject
      ).filter((key) => !cred.excluded.includes(key));
      const credentialSubject: Record<string, unknown> = {};
      for (const key of credentialSubjectKeys) {
        credentialSubject[key] = cred.vc[key];
      }
      creds.push({
        vc: { ...cred.vc, credentialSubject },
        result: cred.result,
      });
    });

    res.json({ name: result.name, creds });
  }
);
