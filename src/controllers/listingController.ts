import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { instanseOfAny } from "../misc";
import { AdvertisementModel } from "../models/advertisementModel";
import {
  AdvertisementNotFound,
  AdvertisementRightsError,
  UpdateAdvertisementRightsError,
} from "../models/errors/advertisementErrors";
import { ReadOnlyError } from "../models/errors/generalErrors";
import { UserIsNotAdminError, UserNotFound } from "../models/errors/userErrors";
import { UserModel } from "../models/userModel";
import { AdvertisementRepository } from "../repositories/advertisimentRepository";
import { RentRepository } from "../repositories/rentRepository";
import { UserRepository } from "../repositories/userRepository";
import { Validate } from "../validationDecorator";
import { BaseController } from "./baseController";

class ListingController extends BaseController {
  private _userManager: UserModel;
  private _advManager: AdvertisementModel;

  constructor(prisma: PrismaClient) {
    super(prisma);

    const _advRepo = new AdvertisementRepository(prisma);
    const _rentRepo = new RentRepository(prisma);
    const _userRepo = new UserRepository(prisma);

    this._advManager = new AdvertisementModel(_advRepo, _userRepo, _rentRepo);
    this._userManager = new UserModel(_userRepo);
  }

  @Validate
  public async get(req: Request, res: Response) {
    const { id, ownerId, rentDates } = matchedData(req);

    try {
      const advs = await this._advManager.getAdvertisementsWithFilter({
        id,
        ownerId,
      });

      if (advs.length === 0) {
        res.status(400).json({ advertisements: [] });
      } else {
        res.status(200).json({ advertisements: advs });
      }
    } catch (e) {
      res.status(500).json({ error: "server error" });
    }
  }

  @Validate
  public async post(req: Request, res: Response) {
    const { description, address, cost } = matchedData(req);
    const ownerId = req.body.userId;

    try {
      const id = await this._advManager.createAdvertisement({
        description,
        address,
        cost,
        ownerId,
      });

      res.status(201).json({ id });
    } catch (e) {
      if (e instanceof ReadOnlyError) {
        res.status(404).json();
      } else {
        res.status(500).json({ error: "server error" });
      }
    }
  }

  @Validate
  public async patch(req: Request, res: Response) {
    const { id, score, description, isApproved, cost, address } =
      matchedData(req);

    const userId = req.body.userId;

    try {
      const updAd = await this._advManager.updateAdvertisement(userId, {
        id,
        score,
        description,
        isApproved,
        cost,
        address,
      });

      res.status(200).json({ advertisement: { ...updAd } });
    } catch (e) {
      if (
        instanseOfAny(e as any, [
          AdvertisementNotFound,
          UserNotFound,
          UserIsNotAdminError,
          UpdateAdvertisementRightsError,
        ])
      ) {
        res.status(400).json({ errors: (e as Error).message });
      } else if (e instanceof ReadOnlyError) {
        res.status(404).json();
      } else {
        res.status(500).json({ error: "server error" });
      }
    }
  }

  @Validate
  public async delete(req: Request, res: Response) {
    const { id } = matchedData(req);
    const userId = req.body.userId;

    try {
      await this._advManager.deleteAdvertisements(userId, id);

      res.status(204);
    } catch (e) {
      if (
        instanseOfAny(e as any, [
          UserNotFound,
          AdvertisementRightsError,
          AdvertisementNotFound,
        ])
      ) {
        res.status(400).json({ errors: (e as Error).message });
      } else if (e instanceof ReadOnlyError) {
        res.status(404).json();
      } else {
        res.status(500).json({ error: "server error" });
      }
    }
  }
}

export default ListingController;
