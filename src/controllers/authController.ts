import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { WrongPasswordOrLoginError } from "../models/errors/userErrors";
import { UserModel } from "../models/userModel";
import { UserRepository } from "../repositories/userRepository";
import { Validate } from "../validationDecorator";
import { BaseController } from "./baseController";

export class AuthController extends BaseController {
  private _userManager: UserModel;
  constructor(prisma: PrismaClient) {
    super(prisma);
    const _userRepo = new UserRepository(this._prisma);
    this._userManager = new UserModel(_userRepo);
  }

  @Validate
  public async login(req: Request, res: Response) {
    const { login, password } = matchedData(req);

    try {
      const token = await this._userManager.loginUser(login, password);
      res.status(200).json({ token });
    } catch (e) {
      if (e instanceof WrongPasswordOrLoginError) {
        res.status(400).json({ errors: e.message });
      } else {
        console.log((e as Error).message);
        res.status(500).json({ errors: (e as Error).message });
      }
    }
  }
}
