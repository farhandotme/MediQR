import express from "express";
import {
  changePassword,
  DeleteAnUser,
  forgetPasswordSendEmail,
  getAllUsers,
  getUser,
  loginUser,
  logoutUser,
  otpVerification,
  registerUser,
  resendOtp,
  updateUser,
  uploadReport,
} from "../controllers/userControllers";
import { isloggedin } from "../middlewares/isLoggedin";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.patch("/updateUser", isloggedin, updateUser);
router.get("/profile", getUser);
router.get("/getAllUser", getAllUsers);
router.post("/email/verify", otpVerification);
router.post("/email/resendOtp", resendOtp);
router.patch("/uploadReport/:id", uploadReport);
router.delete("/deleteUser/:id", DeleteAnUser);
router.post("/sendForgetPasswordLink", forgetPasswordSendEmail);
router.patch("/changePassword/:id", changePassword);

export default router;
