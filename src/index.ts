import { json, urlencoded } from "body-parser";
import cookieParser from "cookie-parser";
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
app.use(cookieParser());

app.use("/api", apiRouter);

app.listen(config.port, () => {
  console.log("Running");
});
