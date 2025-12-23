import { Router } from 'express';
import { AvailabilityExceptionController } from '../controllers/availabilityException.js';
import { authenticate } from "../middlewares/authenticate.js";

export const availabilityExceptionsRouter = Router();

availabilityExceptionsRouter.use(authenticate)

availabilityExceptionsRouter.post('/', AvailabilityExceptionController.createException);
availabilityExceptionsRouter.get('/staff/:staffId', AvailabilityExceptionController.getAllExceptionByStaffMemberId);
availabilityExceptionsRouter.delete('/:staffMemberId/:exceptionId', AvailabilityExceptionController.deleteException);
availabilityExceptionsRouter.get('/:staffMemberId/:exceptionId', AvailabilityExceptionController.getExceptionById);
availabilityExceptionsRouter.put('/:staffMemberId/:exceptionId', AvailabilityExceptionController.updateException);