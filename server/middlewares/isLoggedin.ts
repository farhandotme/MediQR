import jwt, { JwtPayload } from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
export const isloggedin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.cookies.token) {
      return res.status(200).json({
        message: "You must logged in",
      });
    }
    let data = jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    (req as any).data = data;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
