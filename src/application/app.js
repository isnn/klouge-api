
import express from "express";
import { publicRouter } from "../routes/publicRouter.js";
import { errorMiddleware } from "../middlewares/error-middleware.js";
import { userRouter } from "../routes/api.js";
import cookieParser from "cookie-parser";

export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(publicRouter)
app.use(userRouter);
app.use(errorMiddleware);
