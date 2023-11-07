import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { body, param } from "express-validator";
import ListingController from "../controllers/listingController";
import { AuthenticateMiddleware } from "../middlewares/authenticateMiddleware";

const listingRouter = Router();
const prisma = new PrismaClient();
const listingController = new ListingController(prisma);
const authMiddleware = new AuthenticateMiddleware(prisma);

listingRouter.post(
  "/",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  body(["description", "address"]).notEmpty().trim().escape(),
  body("cost").isNumeric(),
  listingController.createAdvertisement.bind(listingController)
);

listingRouter.get(
  "/:id",
  param("id").notEmpty().escape(),
  listingController.getAdvertisement.bind(listingController)
);
listingRouter.get(
  "/users/:ownerId",
  param("ownerId").isUUID(),
  listingController.getUsersAdvertisements.bind(listingController)
);

listingRouter.post(
  "/:adId/rent",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  body(["from", "to"]).isDate(),
  param(["adId"]).isUUID(),
  listingController.newRent.bind(listingController)
);

listingRouter.patch(
  "/:adId/approval",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  param("adId").isUUID(),
  listingController.approveAdvertisement.bind(listingController)
);

listingRouter.delete(
  "/:id",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  param("id").isUUID(),
  listingController.deleteAdvertisement.bind(listingController)
);

listingRouter.get(
  "/:adId/rent/dates",
  param("adId").notEmpty().escape(),
  listingController.getAdvertisementRentDates.bind(listingController)
);

listingRouter.get(
  "/rent/users/:id",
  param("id").isUUID(),
  listingController.getUsersRents.bind(listingController)
);

export default listingRouter;
