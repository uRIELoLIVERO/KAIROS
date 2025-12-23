import { Router } from 'express';
import { ProfessionalController, upload } from '../controllers/professional.js';

export const professionalsRouter = Router();

professionalsRouter.get('/:id', ProfessionalController.getProfessionalById);
professionalsRouter.patch('/:id/profile', upload.single("profilePicture"), ProfessionalController.updateProfessional);
professionalsRouter.get('/user/:id', ProfessionalController.getProfessionalByUserId);
