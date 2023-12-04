import { Router } from "express";
import { body, param } from "express-validator";
import { UserController } from "../controllers/userController";
import prisma from "../prismaInstance";

const userRouter = Router();
const userController = new UserController(prisma);

userRouter.get(
  "/:id",
  param("id").optional().notEmpty().escape().isUUID(),
  userController.get.bind(userController)
);

userRouter.post(
  "/",
  body(["login", "password"]).trim().escape().notEmpty(),
  userController.signup.bind(userController)
);
export default userRouter;
