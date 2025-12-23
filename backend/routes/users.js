import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate.js';
import { UserController } from '../controllers/user.js';

export const userRouter = Router();

userRouter.use(authenticate)

userRouter.get('/:email', UserController.getUserByEmail)