import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { body, query } from "express-validator";
import { AuthController } from "../controllers/authController";

const authRouter = Router();
const prisma = new PrismaClient();
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
