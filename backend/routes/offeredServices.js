import { Router } from 'express';
import { OfferedServiceController } from '../controllers/offeredService.js';
import { authenticate } from '../middlewares/authenticate.js';

export const offeredServicesRouter = Router();

offeredServicesRouter.use(authenticate);

offeredServicesRouter.post('/', OfferedServiceController.createOfferedService);
offeredServicesRouter.get('/my-offered-services', OfferedServiceController.getMyOfferedServices);
offeredServicesRouter.get('/:staffMemberId', OfferedServiceController.getOfferedServicesByProfessional);
offeredServicesRouter.put('/:id', OfferedServiceController.updateOfferedService);
offeredServicesRouter.delete('/:id', OfferedServiceController.deleteOfferedService);