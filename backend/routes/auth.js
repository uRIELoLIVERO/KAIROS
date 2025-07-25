import { Router } from "express"
import { AuthController } from '../controllers/auth.js'
import { authenticate } from '../middlewares/authenticate.js';

export const authRouter = Router()


authRouter.post("/register", AuthController.register)
authRouter.post("/login", AuthController.login)
authRouter.post("/logout", authenticate, AuthController.logout)
authRouter.post("/refresh-token", AuthController.refreshToken)
authRouter.post("/forgot-password", AuthController.forgotPassword)
authRouter.post("/reset-password", AuthController.resetPassword)
authRouter.get('/me', authenticate, AuthController.me);
