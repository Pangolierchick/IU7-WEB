import { Router } from "express";
import { query } from "express-validator";
import { UserController } from "../controllers/userController";
import prisma from "../prismaInstance";

const userRouter = Router();
const userController = new UserController(prisma);

userRouter.get(
  "/",
  query("login").optional().notEmpty().escape(),
  query("id").optional().notEmpty().escape().isUUID(),
  userController.get.bind(userController)
);

export default userRouter;
