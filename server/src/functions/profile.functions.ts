import { IUser, IUserDocument, User } from "../models/user.model";
import { IProfile, IProfileDocument, Profile } from "../models/profile.model";

/**
 * Create a new profile if it doesn't exist and then return the
 * mongoose document of that profile
 *
 * @param {IProfile} profile
 * @returns {IProfileDocument} created profile
 */

export const createProfile = async (
  profile: IProfile,
  user: IUserDocument
): Promise<IProfileDocument> => {
  const profileExists = await Profile.findOne({ name: profile.name });
  if (!profileExists) {
    const newProfile = await Profile.create(profile).catch((error) => {
      console.error(error);
      throw new Error("unable to create profile");
    });
    user.profiles.push(newProfile._id);
    await user.save();
    return newProfile;
  } else {
    throw new Error(`Profile ${profile.name} already exists`);
  }
};

/**
 * Get all the profiles that are stored in the DB currently
 *
 * @param {IUserDocument} user
 * @returns {IProfileDocument[]}
 */

export const getProfiles = async (user: IUserDocument): Promise<any> => {
  // the any return type is to prevent TS from going nuts as
  // it doesnt understand my High IQ move of getting the user's
  // populated profiles instead of indexing all profiles

  const { profiles } = await User.findById(user._id)
    .populate("profiles")
    .select("profiles")
    .exec();

  return profiles;
};

/**
 * Find a profile by ID and then edit it
 *
 * @param {string} id
 * @param {IProfile} profile
 * @returns {IProfileDocument}
 */

export const editProfileById = async (
  id: string,
  profileData: IProfile,
  user: IUserDocument
): Promise<IProfileDocument> => {
  const profile = await Profile.findById(id);
  if (!profile) throw new Error("profile not found");

  if (user.profiles.includes(profile._id)) {
    // change stuff
    profile.name = profileData.name ?? profile.name;
    profile.creds = profileData.creds ?? profile.creds;
    // save stuff
    const profileSaved = await profile.save();
    return profileSaved;
  } else {
    throw new Error("user does not own the profile");
  }
};

/**
 * Delete a profile by id and then return the deleted profile
 *
 * @param {string} id
 * @returns {IProfileDocument} profile deleted
 */

export const deleteProfileById = async (
  id: string,
  user: IUserDocument
): Promise<IProfileDocument> => {
  const profileExists = await Profile.findById(id);
  if (profileExists) {
    if (user.profiles.includes(profileExists._id)) {
      const profileDeleted = (await Profile.findByIdAndDelete(
        id
      )) as IProfileDocument;
      return profileDeleted;
    } else {
      throw new Error("user does not own the profile");
    }
  } else {
    throw new Error(`Profile ${id} not found`);
  }
};
