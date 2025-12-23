import { Router } from 'express';
import { OfferedServiceController } from '../controllers/offeredService.js';
import { authenticate } from '../middlewares/authenticate.js';

export const offeredServicesRouter = Router();

offeredServicesRouter.get('/company/:companyId', OfferedServiceController.getAllOfferedServicesByCompany);

offeredServicesRouter.get('/my-offered-services', authenticate, OfferedServiceController.getMyOfferedServices);
offeredServicesRouter.get('/staff/:staffMemberId', authenticate, OfferedServiceController.getOfferedServicesByProfessional);

offeredServicesRouter.get('/:id', OfferedServiceController.getOfferedServiceById);

offeredServicesRouter.use(authenticate);
offeredServicesRouter.post('/', OfferedServiceController.createOfferedService);
offeredServicesRouter.put('/:id', OfferedServiceController.updateOfferedService);
offeredServicesRouter.delete('/:id', OfferedServiceController.deleteOfferedService);