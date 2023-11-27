import { Router } from "express";
import { body, query } from "express-validator";
import { RentsController } from "../controllers/rentsController";
import { AuthenticateMiddleware } from "../middlewares/authenticateMiddleware";
import prisma from "../prismaInstance";

const rentsRouter = Router();
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
  body(["from", "to"]).isISO8601().toDate(),
  query(["adId"]).isUUID(),
  rentsController.post.bind(rentsController)
);

export default rentsRouter;
