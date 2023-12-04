import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { ReadOnlyError } from "../models/errors/generalErrors";
import { UserAlreadyExistError } from "../models/errors/userErrors";
import { UserModel } from "../models/userModel";
import { UserRepository } from "../repositories/userRepository";
import { Validate } from "../validationDecorator";
import { BaseController } from "./baseController";

export class UserController extends BaseController {
  private _userManager: UserModel;
  constructor(prisma: PrismaClient) {
    super(prisma);
    const _userRepo = new UserRepository(this._prisma);
    this._userManager = new UserModel(_userRepo);
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
  public async get(req: Request, res: Response) {
    const { id, login } = matchedData(req);

    try {
      const users = await this._userManager.getUsersWithFilters({ id, login });

      if (users.length === 0) {
        res.status(400).json({ users: [] });
      } else {
        res.status(200).json({ users });
      }
    } catch (e) {
      res.status(500).json({ error: "server error" });
    }
  }
}
