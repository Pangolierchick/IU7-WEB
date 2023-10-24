import { UserRole } from "./IUser";

export interface IFeedback {
  id: string;
  userId: string;
  adId: string;
  feedback: string;
}

export interface IFeedbackWithUser extends IFeedback {
  role: UserRole;
  login: string;
}
