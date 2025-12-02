import mongoose, { Document, Schema } from "mongoose";
export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}
export interface IReport {
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
  notes?: string;
}
export interface IUser extends Document {
  fullName: string;
  email?: string;
  password?: string;
  phone?: string;
  dateOfBirth?: Date;
  bloodGroup?: string;
  allergies?: string[];
  medicalConditions?: string[];
  medications?: string[];
  emergencyContacts?: EmergencyContact[];
  uniqueId?: string;
  qrcode?: string;
  reports?: IReport[];
  isVerified: boolean;
  otp?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
const EmergencyContactSchema: Schema = new Schema({
  name: { type: String, required: true },
  relation: { type: String, required: true },
  phone: { type: String, required: true },
});
const ReportSchema: Schema = new Schema({
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  notes: { type: String },
});
const UserSchema: Schema<IUser> = new Schema(
  {
    fullName: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    phone: { type: String },
    dateOfBirth: { type: Date },
    bloodGroup: { type: String },
    allergies: { type: [String], default: [] },
    medicalConditions: { type: [String], default: [] },
    medications: { type: [String], default: [] },
    emergencyContacts: { type: [EmergencyContactSchema], default: [] },
    uniqueId: { type: String, unique: true, required: true },
    qrcode: { type: String, unique: true, required: true },
    reports: { type: [ReportSchema], default: [] },
    otp: { type: Number, default: null },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export default mongoose.model<IUser>("User", UserSchema);
