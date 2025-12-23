import { Router } from 'express';
import { AvailabilityController } from '../controllers/availability.js';
import { authenticate } from '../middlewares/authenticate.js';

export const availabilitiesRouter = Router();

// routes/availability.routes.js
availabilitiesRouter.get('/staff/:staffMemberId/with-slots', AvailabilityController.getStaffAvailabilityWithSlots); 
availabilitiesRouter.get('/staff/:staffMemberId', AvailabilityController.getAvailability);

availabilitiesRouter.use(authenticate);

availabilitiesRouter.get('/me', AvailabilityController.getAvailabilityByLoggedUser);
availabilitiesRouter.put('/:staffMemberId', AvailabilityController.updateAvailability);
availabilitiesRouter.post('/', AvailabilityController.createAvailability);
availabilitiesRouter.post('/:availabilityId/initialize-days', AvailabilityController.initializeDays);