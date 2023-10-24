import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { FeedbackManager } from "../managers/feedbackManager";
import { FeedbackRepository } from "../repositories/feedbackRepository";
import { BaseController } from "./baseController";

class FeedbackController extends BaseController {
  private _feedbackManager: FeedbackManager;

  constructor(prisma: PrismaClient) {
    super(prisma);

    const feedbackRepo = new FeedbackRepository(prisma);
    this._feedbackManager = new FeedbackManager(feedbackRepo);
  }

  async getAdvertisimentsFeedbacks(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { adId } = matchedData(req);

      try {
        const feedbacks = await this._feedbackManager.getAdvertisimentFeedbacks(
          adId
        );

        res.status(200).json(feedbacks);
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  async deleteFeedback(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { id } = matchedData(req);
      const { userId } = req.body;

      try {
        await this._feedbackManager.deleteFeedback(userId, id);
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }

  async addFeedback(req: Request, res: Response) {
    const result = validationResult(req);

    if (result.isEmpty()) {
      const { adId, feedback } = matchedData(req);
      const { userId } = req.body;

      try {
        const f = await this._feedbackManager.createFeedback(
          userId,
          adId,
          feedback
        );

        res.status(200).json({ fId: f });
      } catch (e) {
        res.status(500).json({ errors: (e as Error).message });
      }
    } else {
      res.status(400).json({ errors: result.array() });
    }
  }
}

export default FeedbackController;
