import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import {
  InvalidJWT,
  JWTExpired,
  UserAlreadyExistError,
  UserNotFound,
  WrongPasswordOrLoginError,
} from "../models/errors/userErrors";
import { userModel } from "../models/userModel";
import { UserRepository } from "../repositories/userRepository";
import { BaseController } from "./baseController";

export class UserController extends BaseController {
  private _userManager: userModel;
  constructor(prisma: PrismaClient) {
    super(prisma);
    const _userRepo = new UserRepository(this._prisma);
    this._userManager = new userModel(_userRepo);
  }

  public async signup(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { login, password } = matchedData(req);

      try {
        const userId = await this._userManager.addUser(login, password);
        res.json({ userId });
      } catch (e) {
        if (e instanceof UserAlreadyExistError) {
          res.status(400).json({ errors: e.message });
        } else {
          res.status(500).json({ errors: `Something went wrong ${e}` });
        }
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async login(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
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
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async getUserInfo(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { login } = matchedData(req);

      try {
        const user = await this._userManager.getByLogin(login);

        res.status(200).json({
          id: user.id,
          login: user.login,
          score: user.score,
          role: user.role,
        });
      } catch (e) {
        if (e instanceof UserNotFound) {
          res.status(400).json({ errors: e.message });
        } else {
          res.status(500).json({ errors: (e as Error).message });
        }
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async validateToken(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { token } = matchedData(req);
      try {
        await this._userManager.authenticateUser(token);
        res.status(200);
      } catch (e) {
        if (e instanceof JWTExpired) {
          res.status(401).json({ errors: "JWT expired" });
        } else if (e instanceof InvalidJWT) {
          res.status(401).json({ errors: e.message });
        } else {
          res.status(500).json({ errors: (e as Error).message });
        }
      }
    } else {
      res.status(400);
    }
  }

  public async getUserById(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { id } = matchedData(req);

      try {
        const user = await this._userManager.getUser(id);
        res.status(200).json({
          id: user.id,
          login: user.login,
          role: user.role,
          score: user.score,
        });
      } catch (e) {
        if (e instanceof UserNotFound) {
          res.status(400).json({ errors: e.message });
        } else {
          res.status(500).json({ errors: (e as Error).message });
        }
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }
}
