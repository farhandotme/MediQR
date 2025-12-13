import { Request, Response } from "express";
import User from "../models/userModels";
import bcryptjs from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { generateUniqueId } from "../utils/uniqueID";
import { generateQrCodeCloudinary } from "../utils/generateQr";
import { sendVerificationCode, successMessage } from "./sendEmail";
import userModels from "../models/userModels";
//Register user
export const registerUser = async (req: Request, res: Response) => {
  const { fullName, email, password, phone } = req.body;
  const newid: string = await generateUniqueId();
  const newQr: string = await generateQrCodeCloudinary(newid);
  try {
    const VerificationCode = Math.floor(100000 + Math.random() * 900000);
    const user = await User.findOne({ email });
    if (user) {
      if (!user.isVerified) {
        user.otp = VerificationCode;
        await user.save();
        await sendVerificationCode(email, VerificationCode);
        return res
          .status(201)
          .json({ message: "Please verify your email", email });
      }
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      uniqueId: newid,
      qrcode: newQr,
      otp: VerificationCode,
    });
    await sendVerificationCode(email, VerificationCode);
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!);
    res.cookie("token", token, {
      httpOnly: true,
    });
    return res.status(201).json({ message: "Please verify your email", email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error registering user" });
  }
};

export const otpVerification = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.otp !== parseInt(otp)) {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    user.isVerified = true;
    await user.save();
    if (user.isVerified) {
      await successMessage(email);
    }
    return res
      .status(201)
      .json({ message: "OTP verification successfull", data: user });
  } catch (error) {
    return res.status(500).json({ message: "Error verifying OTP" });
  }
};
export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000);
    user.otp = newOtp;
    await user.save();
    await sendVerificationCode(email, newOtp);
    return res
      .status(201)
      .json({ message: "New OTP has been sent to your email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error resending OTP" });
  }
};

//Login user
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email not found. Please Register YourSelf" });
    }
    if (!user.isVerified) {
      return res.status(401).json({ message: "User is not verified" });
    }
    const isPasswordValid = await bcryptjs.compare(
      password,
      user.password || ""
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);
    res.cookie("token", token, {
      httpOnly: true,
    });
    return res.status(201).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in" });
  }
};

//Logout user
export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("token");
  return res.status(201).json({ message: "Logout successful" });
};

// Update user
// export const updateUser = async (req: Request, res: Response) => {
//   try {
//     const userID = req.params.id;
//     const {
//       dateOfBirth,
//       bloodGroup,
//       allergies,
//       medicalConditions,
//       medications,
//       emergencyContacts,
//       qrId,
//     } = req.body || {};

//     const updates: any = {};

//     if (dateOfBirth) updates.dateOfBirth = new Date(dateOfBirth);
//     if (bloodGroup) updates.bloodGroup = bloodGroup;
//     if (allergies) updates.allergies = allergies;
//     if (medicalConditions) updates.medicalConditions = medicalConditions;
//     if (medications) updates.medications = medications;
//     if (emergencyContacts) updates.emergencyContacts = emergencyContacts;
//     if (qrId) updates.qrId = qrId;
//     const updatedUser = await User.findByIdAndUpdate(userID, updates, {
//       new: true,
//     });
//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(201).json({
//       message: "User updated successfully",
//       data: updatedUser,
//     });
//   } catch (error) {
//     console.error("Update Error:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = (req as any).data.userId;
    // const {
    //   dateOfBirth,
    //   bloodGroup,
    //   allergies,
    //   medicalConditions,
    //   medications,
    //   emergencyContacts,
    // } = req.body || {};
    const updateData = req.body;

    const updatedUser = await userModels.findByIdAndUpdate(id, updateData);
    res.status(200).json({
      updatedUser,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user

// Define a custom interface for JWT payload
interface DecodedToken extends JwtPayload {
  _id: string;
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

// upload report
export const uploadReport = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { report } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.reports = user.reports || [];
    user.reports.push(report);
    await user.save();
    res.status(201).json({
      message: "Report uploaded successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const getAllUsers = await userModels.find();
    res.json({ getAllUsers });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Someting Went Wrong" });
    }
  }
};
export const DeleteAnUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log(id);
    const deletedUser = await userModels.findByIdAndDelete({ _id: id });
    res.status(200).json({
      deletedUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
};
