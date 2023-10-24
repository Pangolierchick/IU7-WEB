import { IFeedback, IFeedbackWithUser } from "./IFeedback";
import { IRepository } from "./IRepository";

export interface IFeedbackRepository extends IRepository<IFeedback> {
  getUsersFeedbacks(userId: string): Promise<IFeedback[]>;
  getWithUser(id: string): Promise<IFeedbackWithUser | null>;
  getAdvertisimentFeedbacks(adId: string): Promise<IFeedback[]>;
}
