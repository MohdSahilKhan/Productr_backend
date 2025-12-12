import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  email?: string;
  phone?: string;
  otp?: string;
  otpExpiresAt?: Date;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    otp: { type: String },
    otpExpiresAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
