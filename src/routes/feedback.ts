import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { body, query } from "express-validator";
import FeedbackController from "../controllers/feedbackController";
import { AuthenticateMiddleware } from "../middlewares/authenticateMiddleware";

const feedbackRouter = Router();
const prisma = new PrismaClient();
const feedbackController = new FeedbackController(prisma);
const authMiddleware = new AuthenticateMiddleware(prisma);

feedbackRouter.get(
  "/adFeedbacks",
  query("adId").isUUID(),
  feedbackController.getAdvertisimentsFeedbacks.bind(feedbackController)
);

feedbackRouter.delete(
  "/delFeedback",
  query("id").isUUID(),
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  feedbackController.deleteFeedback.bind(feedbackController)
);

feedbackRouter.post(
  "/createFeedback",
  query("adId").isUUID(),
  body("feedback").notEmpty().escape(),
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  feedbackController.addFeedback.bind(feedbackController)
);

export default feedbackRouter;
