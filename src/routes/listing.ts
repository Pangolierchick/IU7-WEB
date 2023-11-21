import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { body, query } from "express-validator";
import ListingController from "../controllers/listingController";
import { AuthenticateMiddleware } from "../middlewares/authenticateMiddleware";

const listingRouter = Router();
const prisma = new PrismaClient();
const listingController = new ListingController(prisma);
const authMiddleware = new AuthenticateMiddleware(prisma);

listingRouter.get(
  "/",
  query(["id", "ownerId"]).optional().isUUID().trim().escape(),
  query("rentDates").optional().isBoolean(),
  listingController.get.bind(listingController)
);

listingRouter.post(
  "/",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  body(["address", "description"]).notEmpty().trim().escape(),
  body("cost").isNumeric(),
  listingController.post.bind(listingController)
);

listingRouter.patch(
  "/",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  query("id").exists().isUUID(),
  body(["cost", "score"]).optional().isNumeric(),
  body(["address", "description"]).optional().notEmpty().trim().escape(),
  body("isApproved").optional().isBoolean(),
  listingController.patch.bind(listingController)
);

listingRouter.delete(
  "/",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  query("id").toArray().isUUID(),
  listingController.delete.bind(listingController)
);

export default listingRouter;
