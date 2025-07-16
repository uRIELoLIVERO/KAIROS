import { Router } from 'express';
import { OfferedServiceController } from '../controllers/offeredService.js';

export const offeredServicesRouter = Router();

offeredServicesRouter.post('/', OfferedServiceController.createOfferedService);
offeredServicesRouter.get('/:professionalID', OfferedServiceController.getOfferedServicesByProfessional);
offeredServicesRouter.put('/:id', OfferedServiceController.updateOfferedService);
offeredServicesRouter.delete('/:id', OfferedServiceController.deleteOfferedService);