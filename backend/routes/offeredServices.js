import { Router } from 'express';
import { OfferedServiceController } from '../controllers/offeredService.js';
import { authenticate } from '../middlewares/authenticate.js';

export const offeredServicesRouter = Router();

offeredServicesRouter.get('/company/:companyId', OfferedServiceController.getAllOfferedServicesByCompany);

offeredServicesRouter.get('/my-offered-services', authenticate, OfferedServiceController.getMyOfferedServices);
offeredServicesRouter.get('/staff/:staffMemberId', authenticate, OfferedServiceController.getOfferedServicesByProfessional);

offeredServicesRouter.get('/:id', OfferedServiceController.getOfferedServiceById);

offeredServicesRouter.post('/', authenticate, OfferedServiceController.createOfferedService);
offeredServicesRouter.put('/:id', authenticate, OfferedServiceController.updateOfferedService);
offeredServicesRouter.delete('/:id', authenticate, OfferedServiceController.deleteOfferedService);