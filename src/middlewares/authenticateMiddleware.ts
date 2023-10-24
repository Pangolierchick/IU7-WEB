import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { AccountManager } from "../models/accountManager";
import { UserRepository } from "../repositories/userRepository";

export class AuthenticateMiddleware {
  private _userManager: AccountManager;
  constructor(prisma: PrismaClient) {
    const accRepo = new UserRepository(prisma);
    this._userManager = new AccountManager(accRepo);
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
      console.log((e as Error).message);
      res.status(401).json({ errors: "User is not authorised" });
    }
  }
}
