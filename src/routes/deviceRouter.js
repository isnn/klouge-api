import express from 'express';
import deviceController from '../controllers/device-controller.js';
import { deviceMiddleware } from '../middlewares/device-middleware.js';


const deviceRouter = new express.Router();

deviceRouter.use(deviceMiddleware);
deviceRouter.post('/device/metrics', deviceController.createMetrics);

export {
    deviceRouter
}