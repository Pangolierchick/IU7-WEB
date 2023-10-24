import { v4 as uuidv4 } from "uuid";
import { IFeedback } from "../interfaces/IFeedback";
import { IFeedbackRepository } from "../interfaces/IFeedbackRepository";
import { UserRole } from "../interfaces/IUser";

export class FeedbackManager {
  private _feedbackRepo: IFeedbackRepository;

  constructor(feedbackRepo: IFeedbackRepository) {
    this._feedbackRepo = feedbackRepo;
  }

  public async createFeedback(userId: string, adId: string, feedback: string) {
    const builtFeedback = FeedbackBuilder.buildFeedback(userId, adId, feedback);
    await this._feedbackRepo.create(builtFeedback);

    return builtFeedback.id;
  }

  public async getUserFeedbacks(userId: string) {
    return await this._feedbackRepo.getUsersFeedbacks(userId);
  }

  public async deleteFeedback(userId: string, id: string) {
    const f = await this._feedbackRepo.getWithUser(id);

    if (!f) {
      throw new Error("Feedback not found");
    }

    if (f.userId !== userId || f.role !== UserRole.Admin) {
      throw new Error("User neither owner nor admin");
    }

    await this._feedbackRepo.delete(id);
  }

  public async getAdvertisementFeedbacks(adId: string) {
    return await this._feedbackRepo.getAdvertisementFeedbacks(adId);
  }
}

class FeedbackBuilder {
  static buildFeedback(
    userId: string,
    adId: string,
    feedback: string
  ): IFeedback {
    return {
      id: uuidv4(),
      adId,
      userId,
      feedback,
    };
  }
}
