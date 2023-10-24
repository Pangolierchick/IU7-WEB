import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { FavouritesManager } from "../managers/favouritesManager";
import { FavouritesRepository } from "../repositories/favouritesRepository";
import { BaseController } from "./baseController";

class FavouritesController extends BaseController {
  private _favManager: FavouritesManager;

  constructor(prisma: PrismaClient) {
    super(prisma);

    const favRepo = new FavouritesRepository(prisma);
    this._favManager = new FavouritesManager(favRepo);
  }

  async getUsersFavourites(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { userId } = req.body;

      try {
        const favs = await this._favManager.getFavourites(userId);
        res.status(200).json(favs);
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  async addFavourite(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { adId } = matchedData(req);
      const { userId } = req.body;

      try {
        const r = await this._favManager.addFavourite(userId, adId);
        res.status(200).json(r);
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  async deleteFavourite(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { id } = matchedData(req);
      const { userId } = req.body;
      try {
        await this._favManager.deleteFavourite(userId, id);
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }
}

export default FavouritesController;
