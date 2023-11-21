import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { instanseOfAny } from "../misc";
import { AdvertisementModel } from "../models/advertisementModel";
import {
  AdvertisementAlreadyBooked,
  AdvertisementNotApprovedError,
  AdvertisementNotFound,
  OwnerRentError,
  RentDateError,
} from "../models/errors/advertisementErrors";
import { ReadOnlyError } from "../models/errors/generalErrors";
import { UserNotFound } from "../models/errors/userErrors";
import { userModel } from "../models/userModel";
import { AdvertisementRepository } from "../repositories/advertisimentRepository";
import { RentRepository } from "../repositories/rentRepository";
import { UserRepository } from "../repositories/userRepository";
import { Validate } from "../validationDec";
import { BaseController } from "./baseController";

export class RentsController extends BaseController {
  private _userManager: userModel;
  private _advManager: AdvertisementModel;

  constructor(prisma: PrismaClient) {
    super(prisma);
    const _advRepo = new AdvertisementRepository(prisma);
    const _rentRepo = new RentRepository(prisma);
    const _userRepo = new UserRepository(prisma);

    this._advManager = new AdvertisementModel(_advRepo, _userRepo, _rentRepo);
    this._userManager = new userModel(_userRepo);
  }
  @Validate
  public async get(req: Request, res: Response) {
    const { adId, userId } = matchedData(req);

    const rents = await this._advManager.getRents({ adId, userId });

    if (rents.length === 0) {
      res.status(400).json({ rents: [] });
    } else {
      res.status(200).json({ rents });
    }
  }

  @Validate
  public async post(req: Request, res: Response) {
    const { from, to, adId } = matchedData(req);
    const userId = req.body.userId;

    try {
      const rentId = await this._advManager.newRent(
        adId,
        userId,
        new Date(from),
        new Date(to)
      );
      res.status(201).json({ rentId });
    } catch (e) {
      if (
        instanseOfAny(e as any, [
          RentDateError,
          UserNotFound,
          AdvertisementNotFound,
          OwnerRentError,
          AdvertisementNotApprovedError,
          AdvertisementAlreadyBooked,
        ])
      ) {
        res.status(400).json({ errors: (e as Error).message });
      } else if (e instanceof ReadOnlyError) {
        res.status(404).json();
      } else {
        res.status(500).json({ errors: (e as Error).message });
      }
    }
  }
}