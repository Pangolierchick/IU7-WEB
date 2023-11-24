import { json, urlencoded } from "body-parser";
import cors from "cors";
import express from "express";
import { config } from "./config";
import { ExpressLogger } from "./logger";
import apiRouter from "./routes/api";

const app = express();

// app.use(ExpressLogger.createFileLogger());
app.use(ExpressLogger.createConsoleLogger());
app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors());

app.use("/api", apiRouter);

app.listen(config.port, () => {
  console.log(`Running on localhost:${config.port}`);
});

//supertest
export default app;
