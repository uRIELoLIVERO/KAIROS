import { Router } from 'express';
import { StaffMemberController } from '../controllers/staffMember.js';

export const staffMemberRouter = Router();

staffMemberRouter.post('/', StaffMemberController.createStaffMember)

staffMemberRouter.delete('/:id', StaffMemberController.deleteStaffMember)

staffMemberRouter.get('/company/:companyId', StaffMemberController.getAllByCompany);

staffMemberRouter.patch('/:id/role', StaffMemberController.updateRole);