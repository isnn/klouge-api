import { Router } from 'express'; 
import userController from '../controllers/user-controller.js';

const publicRouter = Router();

publicRouter.post('/api/users', userController.register);
publicRouter.post('/api/users/login', userController.login);

export { publicRouter };
