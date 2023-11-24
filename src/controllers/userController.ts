import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
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
