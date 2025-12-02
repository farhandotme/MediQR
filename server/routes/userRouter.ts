import express from "express";
import {
  getUser,
  loginUser,
  logoutUser,
  otpVerification,
  registerUser,
  resendOtp,
  updateUser,
  uploadReport,
} from "../controllers/userControllers";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/updateUser/:id", updateUser);
router.get("/profile", getUser);
router.post("/email/verify", otpVerification);
router.post("/email/resendOtp", resendOtp);
router.patch("/uploadReport/:id", uploadReport);

export default router;
