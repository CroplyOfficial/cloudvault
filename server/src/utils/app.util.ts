import publicIp from "public-ip";
import { networkInterfaces } from "os";
import { CONN_STRING, PORT, STRONGHOLD_SECRET } from "../config";
import { createEncryptedVault, readDataFromVault } from "./stronghold.util";
import crypto from "crypto";
import { connectToDB } from "./mongo.util";

/**
 * Get details of the IP Address, both internal and external and
 * then return both in an Object
 *
 * @returns {Promise<IIPDetails>}
 */

export interface IIPDetails {
  publicAddr: string;
  internalAddr?: string;
  port: string;
}
export const getIPDetails = async (): Promise<IIPDetails> => {
  let internalAddr; // internal ipv4 address
  const publicAddr = await publicIp.v4(); // public ipv4 address
  const port = String(PORT); // port where the server is running at

  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    // @ts-ignore
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        if (
          String(net.address).startsWith("192.168.") ||
          String(net.address).startsWith("10.0.") ||
          String(net.address).startsWith("172.16")
        ) {
          internalAddr = net.address;
        }
      }
    }
  }
  return {
    publicAddr,
    internalAddr,
    port,
  };
};

/**
 * Setup cloudvault and then send the setup data to the
 * cloudvault instance
 */

export interface ICloudVaultConfig {
  publicKey: string;
  ipDetails: IIPDetails;
}
export interface IMasterRecord {
  publicKey: string;
  userId: string;
}
export const getSetupDetails = async (): Promise<ICloudVaultConfig> => {
  const ipDetails = await getIPDetails();
  const masterRecord = await readDataFromVault(
    "master-record",
    STRONGHOLD_SECRET
  );

  if (masterRecord) {
    const { publicKey } = masterRecord as unknown as IMasterRecord;
    return {
      ipDetails,
      publicKey,
    };
  } else {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });

    // plaintext exports of keys
    const pubKey = publicKey.export({
      type: "pkcs1",
      format: "pem",
    }) as string;
    const privKey = privateKey.export({
      type: "pkcs1",
      format: "pem",
    }) as string;

    // create a stronghold vault with the privkey
    await createEncryptedVault({ privKey }, "priv-key", STRONGHOLD_SECRET);

    // create another vault which contains the user data
    await createEncryptedVault(
      { publicKey: pubKey },
      "master-record",
      STRONGHOLD_SECRET
    );

    return {
      ipDetails,
      publicKey: pubKey,
    };
  }
};

// ANOTHER SET OF USELESS TESTS
if (require.main === module) {
  const test = async () => {
    const ipDetails = await getIPDetails();
    console.log(ipDetails);
    connectToDB(CONN_STRING);

    const testSetup = await getSetupDetails();
    console.log("setup details", testSetup);
  };
  test();
}
