import express from "express";
import { getUserDetails } from "../controllers/emergencyControllers";

const router = express.Router();
router.get("/:uniqueId", getUserDetails);

export default router;
