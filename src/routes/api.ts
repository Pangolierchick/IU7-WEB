import { Router } from "express";
import favouritesRouter from "./favourites";
import feedbackRouter from "./feedback";
import listingRouter from "./listing";
import loginRouter from "./login";

const apiRouter = Router();
const apiV1Router = Router();

apiV1Router.use("/user", loginRouter);
apiV1Router.use("/listing", listingRouter);
apiV1Router.use("/feedback", feedbackRouter);
apiV1Router.use("/favourites", favouritesRouter);

apiRouter.use("/v1", apiV1Router);

export default apiRouter;
