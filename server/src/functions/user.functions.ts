import { User, IUser } from "../models/user.model";
import { tokenize } from "../utils/token.util";

/**
 * Create a new user and return the token and user information
 * IMPORTANT: Pass plaintext password it gets changed to a hash
 * during the pre-save hook on mongo :)
 *
 * @param {String} username - username to create
 * @param {String} password - plaintext password to set
 * @returns {Promise<ICreateUser>}
 */

interface ICreateUser {
  user: IUser;
  token: string;
}
export const createUser = async (
  username: string,
  password: string
): Promise<ICreateUser> => {
  const userExists = await User.findOne({ username });
  if (!userExists) {
    const user = await User.create({
      username,
      password,
    }).catch(() => {
      throw new Error("unable to create user");
    });
    const token = tokenize(user._id);

    return {
      user,
      token,
    };
  } else {
    throw new Error("User already exists");
  }
};

/**
 * Login the user and then create issue a token to that said user
 *
 * @param {String} password
 * @returns {Promise<ILoginUser}
 */

interface ILoginUser {
  user: IUser;
  token: string;
}
export const loginUser = async (
  username: string,
  password: string
): Promise<ILoginUser> => {
  const user = await User.findOne({ username });
  if (user) {
    const isMatch = await user.matchPassword(password);
    if (isMatch) {
      const token = tokenize(user._id);
      return {
        user,
        token,
      };
    } else {
      throw new Error("Invalid login credentials");
    }
  } else {
    throw new Error("User not found");
  }
};
