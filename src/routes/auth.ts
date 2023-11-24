import { Router } from "express";
import { body, query } from "express-validator";
import { AuthController } from "../controllers/authController";
import prisma from "../prismaInstance";

const authRouter = Router();
const authController = new AuthController(prisma);

authRouter.get(
  "/",
  query(["login", "password"]).trim().escape().notEmpty(),
  authController.login.bind(authController)
);

authRouter.post(
  "/",
  body(["login", "password"]).trim().escape().notEmpty(),
  authController.signup.bind(authController)
);

export default authRouter;
