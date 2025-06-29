    import express from 'express';
    import { authMiddleware } from '../middlewares/auth-middleware.js';
    import userController from '../controllers/user-controller.js';
    import { hasRole } from "../middlewares/role-middleware.js";
    import deviceController from '../controllers/device-controller.js';

    const userRouter = new express.Router();

    // logout kurang validasi token = id
    userRouter.use('/users', authMiddleware);
    userRouter.get('/users/refresh', userController.refresh);
    userRouter.post('/users/logout', userController.logout);
    userRouter.get('/users/current', userController.getCurrentUser);
    userRouter.put('/users/current', userController.update);
    userRouter.get('/users/:userId', userController.getDetail);
    userRouter.delete('/users/:userId', userController.remove);

    // Devices API
    userRouter.post(`/users/:userId/device`, deviceController.create);
    userRouter.get(`/users/:userId/device`, deviceController.get);
    userRouter.get(`/users/:userId/device/:deviceId`, deviceController.getDetail);
    userRouter.put(`/users/:userId/device/:deviceId`, deviceController.update);
    userRouter.delete(`/users/:userId/device/:deviceId`, deviceController.remove);

    userRouter.post('/users/:userId/device/:deviceId/key', deviceController.apiKeyPost);
    userRouter.get('/users/:userId/device/:deviceId/key/:keyId', deviceController.apiKeyShow);
    userRouter.delete('/users/:userId/device/:deviceId/key/:keyId', deviceController.apiKeyRemove);

    // API receive log

    export {
        userRouter
    }



    // route ../user/* just autechenticate user
