import { Router } from "express";
import { query } from "express-validator";
import ListingController from "../controllers/listingController";
import prisma from "../prismaInstance";

const listingsRouter = Router();
const listingController = new ListingController(prisma);

listingsRouter.get(
  "/",
  query(["id", "ownerId"]).optional().isUUID().trim().escape(),
  query("rentDates").optional().isBoolean(),
  listingController.getMany.bind(listingController)
);

export default listingsRouter;
