import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { body, query } from "express-validator";
import { RentsController } from "../controllers/rentsController";
import { AuthenticateMiddleware } from "../middlewares/authenticateMiddleware";

const rentsRouter = Router();
const prisma = new PrismaClient();
const rentsController = new RentsController(prisma);
const authMiddleware = new AuthenticateMiddleware(prisma);

rentsRouter.get(
  "/",
  query(["adId", "userId"]).isUUID().optional(),
  rentsController.get.bind(rentsController)
);

rentsRouter.post(
  "/",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  body(["from", "to"]).isDate(),
  query(["adId"]).isUUID(),
  rentsController.post.bind(rentsController)
);

export default rentsRouter;
