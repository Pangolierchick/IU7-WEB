import { Router } from "express";
// import swaggerUi from "swagger-ui-express";
import swaggerUi from "swaggerui";
import * as swaggerDocument from "../../openapi.json";
import listingRouter from "./listing";
import userRouter from "./user";

const apiRouter = Router();
const apiV1Router = Router();

apiV1Router.use("/user", userRouter);
apiV1Router.use("/listing", listingRouter);

apiRouter.use("/v1", apiV1Router);
apiRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default apiRouter;
