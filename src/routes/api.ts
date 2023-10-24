import { Router } from "express";
import listingRouter from "./listing";
import loginRouter from "./login";

const apiRouter = Router();
const apiV1Router = Router();

apiV1Router.use("/user", loginRouter);
apiV1Router.use("/listing", listingRouter);

apiRouter.use("/v1", apiV1Router);

export default apiRouter;
