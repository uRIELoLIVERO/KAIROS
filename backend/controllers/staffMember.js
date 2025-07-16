import { StaffMemberModel } from '../models/staffMember.js';

import { validateStaffMember, validatePartialStaffMember } from '../schemas/staffMember.js';

export class StaffMemberController {
    static async getAllProfessionalsByCompany(req, res) {
        try {
            const { id } = req.params;
            const professionals = await StaffMemberModel.getAllProfessionalsByCompany(id);
            return res.status(200).json(professionals);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}