import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { AccountManager } from "../models/accountManager";
import { AdvertisementManager } from "../models/advertisementManager";
import { AdvertisementRepository } from "../repositories/advertisimentRepository";
import { RentRepository } from "../repositories/rentRepository";
import { UserRepository } from "../repositories/userRepository";
import { BaseController } from "./baseController";

class ListingController extends BaseController {
  private _userManager: AccountManager;
  private _advManager: AdvertisementManager;

  constructor(prisma: PrismaClient) {
    super(prisma);

    const _advRepo = new AdvertisementRepository(prisma);
    const _rentRepo = new RentRepository(prisma);
    const _userRepo = new UserRepository(prisma);

    this._advManager = new AdvertisementManager(_advRepo, _userRepo, _rentRepo);
    this._userManager = new AccountManager(_userRepo);
  }

  public async getAdvertisement(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { adId } = matchedData(req);

      try {
        const ad = await this._advManager.getAdvertisementWithOwner(adId);

        res.status(200).json(ad);
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async getUsersAdvertisements(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { ownerId } = matchedData(req);
      try {
        const ads = await this._advManager.getUsersAdvertisements(ownerId);

        res.json(ads);
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async createAdvertisement(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const ownerId = req.body.userId;
      const { description, cost, address } = matchedData(req);

      try {
        const adId = await this._advManager.addAdvertisement({
          ownerId,
          description,
          cost: Number(cost),
          address,
        });

        res.status(201).json({ adId });
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async newRent(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { from, to, adId } = matchedData(req);
      const userId = req.body.userId;

      try {
        const rent = await this._advManager.newRent(
          adId,
          userId,
          new Date(from),
          new Date(to)
        );
        res.status(201).json({ rent });
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async approveAdvertisement(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { adId } = matchedData(req);
      const adminId = req.body.userId;

      try {
        const r = await this._advManager.approveAd(adId, adminId);
        res.status(200).json({ result: "success" });
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async deleteAdvertisement(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { adId } = matchedData(req);
      const ownerId = req.body.userId;

      try {
        await this._advManager.deleteAd(adId, ownerId);
        res.status(200).json({ result: "success" });
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async searchAdvertisements(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { address } = matchedData(req);

      try {
        const ads = await this._advManager.searchAdvertisements(address);
        res.status(200).json({ ads });
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async getAdvertisementRentDates(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { adId } = matchedData(req);

      try {
        const dates = await this._advManager.getAdvertisementsRentDates(adId);

        res.status(200).json(dates);
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  public async getUsersRents(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { id } = matchedData(req);

      try {
        const rents = await this._advManager.getUsersRents(id);
        res.status(200).json(rents);
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }
}

export default ListingController;
