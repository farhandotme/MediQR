import jwt, { JwtPayload } from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
const isloggedin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies.token) {
      return res.status(200).json({
        message: "You must logged in",
      });
    }
    let data = (await jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET as string
    )) as JwtPayload;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
