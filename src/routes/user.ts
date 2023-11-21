import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { query } from "express-validator";
import { UserController } from "../controllers/userController";

const userRouter = Router();
const prisma = new PrismaClient();
const userController = new UserController(prisma);

userRouter.get(
  "/",
  query("login").optional().notEmpty().escape(),
  query("id").optional().notEmpty().escape().isUUID(),
  userController.get.bind(userController)
);

export default userRouter;
