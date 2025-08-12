import { Router } from 'express';
import { AvailabilityController } from '../controllers/availability.js';
import { authenticate } from '../middlewares/authenticate.js';

export const availabilitiesRouter = Router();
availabilitiesRouter.use(authenticate);

availabilitiesRouter.get('/me', AvailabilityController.getAvailabilityByLoggedUser);
availabilitiesRouter.get('/:staffMemberId', AvailabilityController.getAvailability);
availabilitiesRouter.put('/:staffMemberId', AvailabilityController.updateAvailability);
