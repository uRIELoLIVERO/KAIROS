import { Router } from 'express';
import { AvailabilityController } from '../controllers/availability.js';
import { authenticate } from '../middlewares/authenticate.js';

export const availabilitiesRouter = Router();
availabilitiesRouter.use(authenticate);

availabilitiesRouter.get('/me', AvailabilityController.getAvailabilityByLoggedUser);
availabilitiesRouter.get('/staff/:staffMemberId', AvailabilityController.getAvailability);
availabilitiesRouter.put('/:staffMemberId', AvailabilityController.updateAvailability);
availabilitiesRouter.post('/', AvailabilityController.createAvailability);
availabilitiesRouter.post('/:availabilityId/initialize-days', AvailabilityController.initializeDays);