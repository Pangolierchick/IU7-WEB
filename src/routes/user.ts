import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { body, query } from "express-validator";
import { UserController } from "../controllers/userController";

const userRouter = Router();
const prisma = new PrismaClient();
const userController = new UserController(prisma);

userRouter.post(
  "/login",
  query(["login", "password"]).notEmpty().escape(),
  userController.login.bind(userController)
);
userRouter.post(
  "/signup",
  body(["login", "password"]).notEmpty().escape(),
  userController.signup.bind(userController)
);
userRouter.get(
  "/getUser",
  query("login").notEmpty().escape(),
  userController.getUserInfo.bind(userController)
);

userRouter.get(
  "/validateToken",
  query(["token"]).notEmpty().escape(),
  userController.validateToken.bind(userController)
);
userRouter.get(
  "/getUserById",
  query(["id"]).isUUID(),
  userController.getUserById.bind(userController)
);

export default userRouter;
