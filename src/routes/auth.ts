import { Router } from "express";
import { query } from "express-validator";
import { AuthController } from "../controllers/authController";
import prisma from "../prismaInstance";

const authRouter = Router();
const authController = new AuthController(prisma);

authRouter.get(
  "/",
  query(["login", "password"]).trim().escape().notEmpty(),
  authController.login.bind(authController)
);

export default authRouter;
