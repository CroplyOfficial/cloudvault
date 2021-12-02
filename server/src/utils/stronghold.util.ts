import { promisify } from "util";
import proc from "child_process";
import path from "path";

const exec = promisify(proc.exec);

// STRONGHOLD SUBMOD PATH
const stronghold_path = path.resolve(__dirname, "../../stronghold/");

/**
 * Create a new stronghold vault and stash the data
 * encrypted in the said vault
 *
 * @async
 * @param {Record<string, unknown>} data - data to stash
 * @param {String} record - index of the data
 * @param {String} password - password for the vault
 * @returns {Promise<void>}
 */

export const createEncryptedVault = async (
  data: Record<string, unknown>,
  record: string,
  password: string
): Promise<void> => {
  const { stdout } = await exec(
    `cargo run --example cli write --plain '${JSON.stringify(
      data
    )}' --record-path "${record}" --pass "${password}"`,
    { cwd: stronghold_path }
  );
};

/**
 * Read data from a vault and return the data in object
 * form, requires password
 *
 * @param {String} password - Password to unlock the vault
 * @param {String} record - Index of the vault
 */

export const readDataFromVault = async (
  record: string,
  password: string
): Promise<Record<string, unknown>> => {
  const { stdout } = await exec(
    `cargo run --example cli read --record-path "${record}" --pass "${password}"`,
    { cwd: stronghold_path }
  );
  if (stdout) {
    const data = JSON.parse(stdout.split("Data: ")[1]);
    return data;
  } else {
    throw new Error("unable to access the vault");
  }
};

// TARRY NOT WANDERER
// 'TIS BUT A BASIC TEST
if (require.main === module) {
  const test = async () => {
    console.log(stronghold_path);
    await createEncryptedVault({ message: "test" }, "test-index", "password");
    const data = await readDataFromVault("test-index", "password");
    console.log(data);
  };
  test();
}
