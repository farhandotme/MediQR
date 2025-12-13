import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./DB/dbConfig";
import userRouter from "./routes/userRouter";
import emergencyRouter from "./routes/emergencyRoute";
import doctorRouter from "./routes/doctorRouter";
import cookieParser from "cookie-parser";

connectDB();
app.use(
  cors({
    origin: [`${process.env.FRONTEND_URL}`],
  })
);
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/emergency", emergencyRouter);
app.use("/api/users", userRouter);
app.use("/api/doctors", doctorRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Hi MediQR Server",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
