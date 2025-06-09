import express from 'express';
import { authMiddleware } from '../middlewares/auth-middleware.js';
import userController from '../controllers/user-controller.js';
import { hasRole } from "../middlewares/role-middleware.js";
import deviceController from '../controllers/device-controller.js';

const base_path = '/api/v1';

const userRouter = new express.Router();

userRouter.use(authMiddleware);
userRouter.get('/api/users/refresh', userController.refresh);
userRouter.post('/api/users/logout', userController.logout);
userRouter.get('/api/users/current', userController.getCurrentUser);
userRouter.put('/api/users/current', userController.update);
userRouter.get('/api/users/:userId', userController.getDetail);
userRouter.delete('/api/users/:userId', userController.remove);

// Devices API
userRouter.post(`/api/users/:userId/device`, deviceController.create);
userRouter.get(`/api/users/:userId/device`, deviceController.get);
userRouter.get(`/api/users/:userId/device/:deviceId`, deviceController.getDetail);
userRouter.put(`/api/users/:userId/device/:deviceId`, deviceController.update);
userRouter.delete(`/api/users/:userId/device/:deviceId`, deviceController.remove);

userRouter.post('/api/users/:userId/device/:deviceId/key', deviceController.apiKeyPost);
userRouter.get('/api/users/:userId/device/:deviceId/key/:keyId', deviceController.apiKeyShow);
userRouter.delete('/api/users/:userId/device/:deviceId/key/:keyId', deviceController.apiKeyRemove);

// API receive log

export {
    userRouter
}



// route ../user/* just autechenticate user
