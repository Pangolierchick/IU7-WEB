import { Router } from "express";
import { body, param } from "express-validator";
import { RentsController } from "../controllers/rentsController";
import { AuthenticateMiddleware } from "../middlewares/authenticateMiddleware";
import prisma from "../prismaInstance";

const rentRouter = Router();
const rentsController = new RentsController(prisma);
const authMiddleware = new AuthenticateMiddleware(prisma);

rentRouter.get(
  "/:id",
  param("id").isUUID(),
  rentsController.get.bind(rentsController)
);

rentRouter.post(
  "/",
  authMiddleware.authenticateMiddleware.bind(authMiddleware),
  body(["from", "to"]).isISO8601().toDate(),
  body(["adId"]).isUUID(),
  rentsController.post.bind(rentsController)
);

export default rentRouter;
