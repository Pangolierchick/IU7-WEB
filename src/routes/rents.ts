import { Router } from "express";
import { query } from "express-validator";
import { RentsController } from "../controllers/rentsController";
import prisma from "../prismaInstance";

const rentsRouter = Router();
const rentsController = new RentsController(prisma);
prisma;

rentsRouter.get(
  "/",
  query(["adId", "userId"]).isUUID().optional(),
  rentsController.getMany.bind(rentsController)
);

export default rentsRouter;
