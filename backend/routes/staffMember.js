import { Router } from 'express';
import { StaffMemberController } from '../controllers/staffMember.js';
import { authenticate } from '../middlewares/authenticate.js';

export const staffMemberRouter = Router();

staffMemberRouter.get('/company/:companyId', StaffMemberController.getAllByCompany);

staffMemberRouter.use(authenticate)

staffMemberRouter.post('/', StaffMemberController.createStaffMember)

staffMemberRouter.get('/user/:userId', StaffMemberController.getAllByUser);

staffMemberRouter.get('/:id', StaffMemberController.getStaffMemberById)

staffMemberRouter.patch('/:id/role', StaffMemberController.updateRole);

staffMemberRouter.delete('/:id', StaffMemberController.deleteStaffMember)