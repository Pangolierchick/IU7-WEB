import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { body, param, query } from "express-validator";
import { UserController } from "../controllers/userController";

const userRouter = Router();
const prisma = new PrismaClient();
const userController = new UserController(prisma);

userRouter.get(
  "/auth",
  query(["login", "password"]).notEmpty().escape(),
  userController.login.bind(userController)
);
userRouter.post(
  "/auth",
  body(["login", "password"]).notEmpty().escape(),
  userController.signup.bind(userController)
);
userRouter.get(
  "/:login",
  param("login").notEmpty().escape(),
  userController.getUserInfo.bind(userController)
);

userRouter.get(
  "/id/:id",
  param(["id"]).isUUID(),
  userController.getUserById.bind(userController)
);

export default userRouter;
