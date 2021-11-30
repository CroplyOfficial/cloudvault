import { User, IUser } from "../models/user.model";

interface ICreateUser {
  user: IUser;
  token: string;
}
const createUser = async (
  username: string,
  password: string
): Promise<ICreateUser> => {
  const user = await User.create({
    username,
    password,
  }).catch(() => {
    throw new Error("unable to create user");
  });
};
