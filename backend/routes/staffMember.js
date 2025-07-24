import { Router } from 'express';
import { StaffMemberController } from '../controllers/staffMember.js';

export const staffMemberRouter = Router();

staffMemberRouter.post('/', StaffMemberController.createStaffMember)

staffMemberRouter.get('/company/:companyId', StaffMemberController.getAllByCompany);

staffMemberRouter.get('/:id', StaffMemberController.getStaffMemberById)

staffMemberRouter.patch('/:id/role', StaffMemberController.updateRole);

staffMemberRouter.delete('/:id', StaffMemberController.deleteStaffMember)