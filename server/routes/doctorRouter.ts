import express from "express";
import {
  loginDoctor,
  registerDoctor,
  updateDoctorProfile,
} from "../controllers/doctorController";

const router = express.Router();

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.put("/updateDoctor/:id", updateDoctorProfile);

export default router;
