import mongoose, { mongo } from "mongoose";

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  creds: {
    type: [{ type: { vc: { type: Object }, excluded: { type: Array } } }],
    required: true,
    default: [],
  },
  authorized: {
    type: [{ type: String }],
  },
});

export interface ICredConfig {
  vc: Record<string, unknown>;
  excluded: string[];
}

export interface IProfile {
  name: string;
  creds: ICredConfig[];
  authorized?: string[];
}

export interface IProfileDocument extends mongoose.Document, IProfile {}

const Profile = mongoose.model<IProfileDocument>("Profile", ProfileSchema);
export { Profile };
