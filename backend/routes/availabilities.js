import { Router } from 'express';
import { AvailabilityController } from '../controllers/availability.js';

export const availabilitiesRouter = Router();

availabilitiesRouter.get('/:staffMemberId', AvailabilityController.getAvailability);
availabilitiesRouter.put('/:staffMemberId', AvailabilityController.updateAvailability);
