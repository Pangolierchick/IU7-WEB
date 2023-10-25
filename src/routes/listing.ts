import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { body, query } from "express-validator";
import ListingController from "../controllers/listingController";
import { AuthenticateMiddleware } from "../middlewares/authenticateMiddleware";

const listingRouter = Router();
const prisma = new PrismaClient();
const listingController = new ListingController(prisma);
const authMiddleware = new AuthenticateMiddleware(prisma);

listingRouter.post(
  "/createAdvertisement",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  body(["description", "address"]).notEmpty().trim().escape(),
  body("cost").isNumeric(),
  listingController.createAdvertisement.bind(listingController)
);

listingRouter.get(
  "/getAdvertisement",
  query("adId").notEmpty().escape(),
  listingController.getAdvertisement.bind(listingController)
);
listingRouter.get(
  "/getUsersAdvertisements",
  query("ownerId").isUUID(),
  listingController.getUsersAdvertisements.bind(listingController)
);

listingRouter.post(
  "/createRent",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  body(["from", "to"]).isDate(),
  body(["adId"]).isUUID(),
  listingController.newRent.bind(listingController)
);

listingRouter.patch(
  "/approveAd",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  body("adId").isUUID(),
  listingController.approveAdvertisement.bind(listingController)
);

listingRouter.delete(
  "/deleteAd",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  query("adId").isUUID(),
  listingController.deleteAdvertisement.bind(listingController)
);

listingRouter.get(
  "/searchAds",
  query("address").escape(),
  listingController.searchAdvertisements.bind(listingController)
);

listingRouter.get(
  "/getAdvertisementRentDates",
  query("adId").notEmpty().escape(),
  listingController.getAdvertisementRentDates.bind(listingController)
);

listingRouter.get(
  "/getUsersRents",
  query("id").isUUID(),
  listingController.getUsersRents.bind(listingController)
);

export default listingRouter;
