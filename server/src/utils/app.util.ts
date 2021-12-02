import publicIp from "public-ip";
import { networkInterfaces } from "os";
import { PORT } from "../config";

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
          String(net.address).startsWith("10.0.")
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

if (require.main === module) {
  const test = async () => {
    const ipDetails = await getIPDetails();
    console.log(ipDetails);
  };
  test();
}
