import { Router } from 'express';
import { ServiceController } from '../controllers/service.js';

export const servicesRouter = Router();

servicesRouter.post('/', ServiceController.createService);

servicesRouter.get('/', ServiceController.getAllServices);

servicesRouter.get('/:id', ServiceController.getServiceById);

servicesRouter.put('/:id', ServiceController.updateService);

servicesRouter.delete('/:id', ServiceController.deleteService);
