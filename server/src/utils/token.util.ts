import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const tokenize = (userId: string): string => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

export { tokenize };
