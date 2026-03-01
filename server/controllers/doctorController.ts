import { Request, Response } from "express";
import doctorModels from "../models/doctorModels";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { receivedApplicationOfDoctor } from "./sendEmail";
import userModels from "../models/userModels";

//Register doctor
export const registerDoctor = async (req: Request, res: Response) => {
  const {
    fullName,
    email,
    password,
    phone,
    specialization, // string
    dateOfBirth, // date of birth
    licenseNumber, // number
    hospitalName,
    registrationNumber, // number
    profileImage, // image link string
    idProof, // image link string
    role,
  } = req.body;
  const exitingDoctor = await doctorModels.findOne({ email });
  const isUsingEmail = await userModels.findOne({ email });

  if (isUsingEmail) {
    return res
      .status(400)
      .json({ message: "Email already using as a Patient" });
  }

  if (exitingDoctor) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const hashedPassword = await bcryptjs.hash(password, 10);
  const newDoctor = await doctorModels.create({
    fullName,
    email,
    password: hashedPassword,
    phone,
    specialization,
    licenseNumber,
    hospitalName,
    profileImage,
    registrationNumber,
    role,
    idProof,
    dateOfBirth,
  });
  const result = await receivedApplicationOfDoctor(email);
  if (!result.success) {
    return res.status(500).json({ message: "Error sending email" });
  }
  return res.status(200).json({
    message: "Your Application Has Sent Successfully",
    data: newDoctor,
  });
};

//Login doctor

export const loginDoctor = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const doctor = await doctorModels.findOne({ email });
  if (!doctor) {
    return res.status(404).json({ message: "Email not found" });
  }
  if (!doctor.isVerified) {
    return res.status(401).json({ message: "Your account is not verified" });
  }
  const isPasswordValid = await bcryptjs.compare(password, doctor.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }
  const token = jwt.sign({ userId: doctor._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
  res.cookie("token", token, {
    httpOnly: true,
  });
  return res.status(200).json({ message: "Login successful", data: doctor });
};


// update the doctor

export const updateDoctorProfile = async (req: Request, res: Response) => {
  const doctorId = req.params.id;
  const { fullName, email, phone, specialization, hospitalName, profileImage } =
    req.body;

  const updatedDoctor = await doctorModels.findByIdAndUpdate(
    doctorId,
    {
      phone,
      specialization,
      hospitalName,
      profileImage,
    },
    { new: true },
  );

  if (!updatedDoctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  return res
    .status(200)
    .json({ message: "Profile updated successfully", data: updatedDoctor });
};
