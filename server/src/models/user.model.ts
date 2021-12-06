import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profiles: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
  },
});

export interface IUser {
  username: string;
  password: string;
  profiles: mongoose.Schema.Types.ObjectId[];
  matchPassword: (pass: string) => Promise<boolean>;
}

export interface IUserDocument extends mongoose.Document, IUser {}

UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  const self: any = this;
  return await bcrypt.compare(enteredPassword, self.password);
};

UserSchema.pre("save", async function (this: any, next: any) {
  const self: any = this;
  if (!self.isModified("password")) {
    next();
  } else {
    const salt = await bcrypt.genSalt(10);
    self.password = await bcrypt.hash(self.password, salt);
  }
});

const User = mongoose.model<IUserDocument>("User", UserSchema);
export { User };
