import { Router } from 'express';
import { ProfessionalController } from '../controllers/professional.js';

export const professionalsRouter = Router();

professionalsRouter.post('/:id/exceptions', ProfessionalController.addProfessionalException);
professionalsRouter.get('/:id', ProfessionalController.getProfessionalByID);
professionalsRouter.get('/:id/availability', ProfessionalController.getProfessionalAvailability);
professionalsRouter.get('/:id/appointments', ProfessionalController.getProfessionalAppointments);
professionalsRouter.put('/:id/availability', ProfessionalController.updateProfessionalAvailability);
professionalsRouter.patch('/:id/profile', ProfessionalController.updateProfessional);
