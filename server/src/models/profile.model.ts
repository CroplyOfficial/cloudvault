import mongoose, { mongo } from "mongoose";

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  creds: {
    type: [{ type: { vc: { type: Object }, excluded: { type: Array } } }],
    required: true,
    default: [],
  },
});

export interface ICredConfig {
  vc: Record<string, unknown>;
  excluded: string[];
}

export interface IProfile {
  name: string;
  creds: ICredConfig[];
}

export interface IProfileDocument extends mongoose.Document, IProfile {}

const Profile = mongoose.model<IProfileDocument>("Profile", ProfileSchema);
export { Profile };
