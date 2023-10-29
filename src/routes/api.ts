import { Router } from "express";
import { resolve } from "path";
import swaggerUi, { SwaggerOptions } from "swagger-ui-express";
import * as swaggerDocument from "../../openapi.json";
import listingRouter from "./listing";
import userRouter from "./user";

const apiRouter = Router();
const apiV1Router = Router();

apiV1Router.use("/user", userRouter);
apiV1Router.use("/listing", listingRouter);

apiRouter.use("/v1", apiV1Router);
apiV1Router.use("/docs", swaggerUi.serve);

const options: SwaggerOptions = {
  route: {
    url: "/api/v1/docs",
  },
  baseDir: resolve("src"),
  swaggerDefinition: {
    host: "localhost",
    basePath: "/api/v1",
    produces: ["application/json"],
  },
};

apiV1Router.get("/docs", swaggerUi.setup(swaggerDocument, undefined, options));

export default apiRouter;
