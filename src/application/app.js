
import express from "express";
import { publicRouter } from "../routes/publicRouter.js";
import { errorMiddleware } from "../middlewares/error-middleware.js";
import { userRouter } from "../routes/api.js";
import cookieParser from "cookie-parser";
import { deviceRouter } from "../routes/deviceRouter.js";

export const app = express();

const base_path_v1 = '/api/v1';

app.use(express.json());
app.use(cookieParser());
app.use(publicRouter)
app.use(base_path_v1, userRouter);
app.use(base_path_v1, deviceRouter);
app.use(errorMiddleware);
