import { Router } from 'express';
import { StaffMemberController } from '../controllers/staffMember.js';

export const staffMemberRouter = Router();

staffMemberRouter.get('/company/:companyId', StaffMemberController.getAllByCompany);

staffMemberRouter.get('/:id/availability', StaffMemberController.getAvailability);

staffMemberRouter.put('/:id/availability', StaffMemberController.updateAvailability);

staffMemberRouter.post('/:id/availability-exceptions', StaffMemberController.addAvailabilityException);

staffMemberRouter.delete('/:id/availability-exceptions/:exceptionId', StaffMemberController.deleteAvailabilityException);

staffMemberRouter.get('/:id/appointments', StaffMemberController.getAppointments);

staffMemberRouter.patch('/:id/role', StaffMemberController.updateRole);
