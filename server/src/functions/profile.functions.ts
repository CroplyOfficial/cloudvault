import { IUserDocument, User } from "../models/user.model";
import { IProfile, IProfileDocument, Profile } from "../models/profile.model";
import { convertToPublicPEM } from "../utils/crypto.util";
import { Client, Network, Config } from "@iota/identity-wasm/node";
import crypto from "crypto";
import dns from "dns/promises";
import bs58 from "bs58";

const clientConfig = Config.fromNetwork(Network.mainnet());
clientConfig.setPermanode("https://chrysalis-chronicle.iota.org/api/mainnet/");

const client = Client.fromConfig(clientConfig);

const sortObject = (object: any) => {
  return Object.keys(object)
    .sort()
    .reduce((r: any, k: any) => ((r[k] = object[k]), r), {});
};

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
    profile.authorized = profileData.authorized ?? profile.authorized ?? [];
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

/**
 * Verify the VerifiableCredential against both the tangle
 * and by validating the signature on the VC against the
 * public key available in the tangle
 *
 * @param VerifiableCredential
 * @returns {IVerifiableCredentialCheck}
 */

interface IVerifiableCredentialCheck {
  DVID: boolean;
  VC: boolean;
}
const verifyCredential = async (
  credential: any
): Promise<IVerifiableCredentialCheck> => {
  const rootDomain = credential.id.split("//")[1].split("/")[0];

  const vcCheck = await client.checkCredential(JSON.stringify(credential));
  const records = await dns.resolveTxt(rootDomain);
  const DVIDKeyRecord = records.find((record) =>
    record[0].includes("DVID.publicKey")
  );
  if (!DVIDKeyRecord) throw new Error("DVID Failed, no record found");
  const DVIDKey = String(DVIDKeyRecord[0].split("DVID.publicKey=")[1]).trim();

  const pem = convertToPublicPEM(DVIDKey);
  const pub = crypto.createPublicKey(pem);

  let data = credential.credentialSubject;
  const sign = bs58.decode(data.sign);
  delete data.sign;

  const sortedObj = sortObject(data);
  const dataBuffer = Buffer.from(JSON.stringify(sortedObj));
  const isDomainVerfied = crypto.verify("SHA256", dataBuffer, pub, sign);

  return {
    DVID: isDomainVerfied,
    VC: vcCheck.verified,
  };
};

/**
 * Verify the profile by looping through all the creds and then return the
 * result of that to the user
 *
 * @param {IProfile} profile
 * @returns {IProfileResult}
 */

interface ICredResult {
  vc: Record<string, unknown>;
  excluded: string[];
  result: {
    DVID: boolean;
    VC: boolean;
  };
}
interface IProfileResult {
  name: string;
  creds: ICredResult[];
}
export const verifyProfile = async (
  profile: IProfile
): Promise<IProfileResult> => {
  const creds = await Promise.all(
    profile.creds.map(async (cred) => {
      const result = await verifyCredential(cred.vc);
      return {
        vc: cred.vc,
        excluded: cred.excluded,
        result,
      };
    })
  );
  const { name } = profile;
  return {
    name,
    creds,
  };
};

/**
 * See if the origin IP is authorized and then if so return the stuff
 * to that said user
 */

export const handleValidationRequest = async (
  ip: string,
  profileId: string
): Promise<IProfileResult> => {
  let addr;
  if (ip.startsWith("http")) {
    const { address } = await dns.lookup(ip.split("://")[1]);
    addr = address;
  } else {
    addr = ip;
  }
  const profile = await Profile.findById(profileId);
  if (!profile) throw new Error("profile not found");
  if (profile.authorized?.includes(addr)) {
    const result = await verifyProfile(profile);
    return result;
  } else {
    throw new Error("Client is not authorized to access this profile");
  }
};
