import { Router } from "express";
import { body, param } from "express-validator";
import ListingController from "../controllers/listingController";
import { AuthenticateMiddleware } from "../middlewares/authenticateMiddleware";
import prisma from "../prismaInstance";

const listingsRouter = Router();
const listingController = new ListingController(prisma);
const authMiddleware = new AuthenticateMiddleware(prisma);

listingsRouter.get(
  "/:id",
  param("id").isUUID().trim().escape(),
  listingController.get.bind(listingController)
);

listingsRouter.post(
  "/",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  body(["address", "description"]).notEmpty().trim().escape(),
  body("cost").isNumeric(),
  listingController.post.bind(listingController)
);

listingsRouter.patch(
  "/:id",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  param("id").exists().isUUID(),
  body(["cost", "score"]).optional().isNumeric(),
  body(["address", "description"]).optional().notEmpty().trim().escape(),
  body("isApproved").optional().isBoolean(),
  listingController.patch.bind(listingController)
);

listingsRouter.delete(
  "/:id",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  param("id").isUUID(),
  listingController.delete.bind(listingController)
);

export default listingsRouter;
