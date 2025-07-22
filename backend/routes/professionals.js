import { Router } from 'express';
import { ProfessionalController } from '../controllers/professional.js';

export const professionalsRouter = Router();

professionalsRouter.get('/:id', ProfessionalController.getProfessionalById);
professionalsRouter.patch('/:id/profile', ProfessionalController.updateProfessional);
