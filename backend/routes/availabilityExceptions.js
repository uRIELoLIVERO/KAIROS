import { Router } from 'express';
import { AvailabilityExceptionController } from '../controllers/availabilityException.js';

export const availabilityExceptionsRouter = Router();

availabilityExceptionsRouter.post('/:staffMemberId', AvailabilityExceptionController.addException);
availabilityExceptionsRouter.delete('/:staffMemberId/:exceptionId', AvailabilityExceptionController.deleteException);
