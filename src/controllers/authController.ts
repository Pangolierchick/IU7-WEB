import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { ReadOnlyError } from "../models/errors/generalErrors";
import {
  UserAlreadyExistError,
  WrongPasswordOrLoginError,
} from "../models/errors/userErrors";
import { userModel } from "../models/userModel";
import { UserRepository } from "../repositories/userRepository";
import { Validate } from "../validationDec";
import { BaseController } from "./baseController";

export class AuthController extends BaseController {
  private _userManager: userModel;
  constructor(prisma: PrismaClient) {
    super(prisma);
    const _userRepo = new UserRepository(this._prisma);
    this._userManager = new userModel(_userRepo);
  }

  @Validate
  public async signup(req: Request, res: Response) {
    const { login, password } = matchedData(req);

    try {
      const userId = await this._userManager.addUser(login, password);
      res.json({ userId });
    } catch (e) {
      if (e instanceof UserAlreadyExistError) {
        res.status(400).json({ errors: e.message });
      } else if (e instanceof ReadOnlyError) {
        res.status(404).json();
      } else {
        res.status(500).json({ errors: "server error" });
      }
    }
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
        res.status(500).json({ errors: (e as Error).message });
      }
    }
  }
}
