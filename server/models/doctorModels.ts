import mongoose, { Document, Schema } from "mongoose";
export interface IDoctor extends Document {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  hospitalName?: string;
  profileImage?: string;
  isVerified: boolean;
  role: "doctor";
  dateOfBirth: Date;
  idProof: string;
  registrationNumber: number;
}


const doctorSchema = new Schema<IDoctor>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    specialization: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    hospitalName: { type: String },
    profileImage: { type: String },
    registrationNumber: {
      type: Number,
      required: true,
    },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: "doctor" },
    dateOfBirth: { type: Date },
    idProof: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model<IDoctor>("Doctor", doctorSchema);
