import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/userModel";
import { UserRepository } from "../repositories/userRepository";

export class AuthenticateMiddleware {
  private _userManager: UserModel;
  constructor(prisma: PrismaClient) {
    const accRepo = new UserRepository(prisma);
    this._userManager = new UserModel(accRepo);
  }

  public async authenticateMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = (req.headers.authorization || "").replace("Bearer ", "");
      const userId = await this._userManager.authenticateUser(token);

      req.body.userId = userId;

      next();
    } catch (e) {
      res.status(401).json({ errors: "User is not authorised" });
    }
  }
}
