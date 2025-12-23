import { StaffMemberModel, AppointmentModel, CompanyModel, ProfessionalModel } from '../models/sequelize/sequelize.js';
import { validatePartialStaffMember } from '../schemas/staffMember.js';
import crypto from 'crypto';

export class StaffMemberController {
  static transformStaffMemberData(staffMember) {
    const data = staffMember.toJSON ? staffMember.toJSON() : staffMember;

    const transformedData = {
      id: data.id,
      companyId: data.company_id || data.companyId,
      professionalId: data.professional_id || data.professionalId,
      roleId: data.role_id || data.roleId,
      deletedAt: data.deleted_at || data.deletedAt
    }

    Object.keys(transformedData).forEach(key =>{
      if (transformedData[key] === undefined) {
        delete transformedData[key]
      }
    })

    return transformedData
  }

  static async createStaffMember(req, res) {
    try {

      const resultStaffMember = validatePartialStaffMember(req.body);

      if (!resultStaffMember.success) {
      return res.status(400).json({ error: resultStaffMember.error.message });
      }

      // Buscar empresa y profesional
      const { companyId, professionalId, roleId = 1 } = resultStaffMember.data

      const company = await CompanyModel.findByPk(companyId);
      const professional = await ProfessionalModel.findOne({ where: { id: professionalId } })
    
      if (!company || !professional) {
        return res.status(404).json({ error: "Company or professional not found" });
      }
    
      const staffMember = await StaffMemberModel.create({
          id: crypto.randomUUID(),
          companyId,
          professionalId,
          roleId,
          availability: company.availability,
          availabilityException: company.availabilityException,
      });
    
      return res.status(201).json({ message: "Professional added to company", staffMember });
    
    } catch (error) {
      console.error('Error', error)
      return res.status(500).json({ error: 'Internal server error' });
    }
  }  

  
  static async getAllByCompany(req, res) {
    try {
      const { companyId } = req.params;

      const staff = await StaffMemberModel.findAll({
        where: { companyId }
      });

      return res.status(200).json(staff.map(s => StaffMemberController.transformStaffMemberData(s)));
    } catch (error) {
      console.error('Error in getAllByCompany:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  static async getAllByUser(req, res) {
    try {
      const { userId } = req.params;

      const professional = await ProfessionalModel.findOne({
        where: { userId }
      })
      const staff = await StaffMemberModel.findAll({
        where: { professionalId: professional.id }
      });

      return res.status(200).json(staff.map(s => StaffMemberController.transformStaffMemberData(s)));
    } catch (error) {
      console.error('Error in getAllByCompany:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getStaffMemberById (req, res) {
    try {
      const { id } = req.params;

      const staffMember = await StaffMemberModel.findByPk(id)
      if (!staffMember) return res.status(400).json({ error: 'StaffMember not found'})

      return res
        .status(200)
        .json(StaffMemberController.transformStaffMemberData(staffMember)) 
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).json({ error: 'Internal server error'})
    }
  }
  
  static async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { error, data } = validatePartialStaffMember(req.body); // Este schema debe validar sólo cambios de rol

      if (error) return res.status(400).json({ error: error.message });

      const [updatedCount] = await StaffMemberModel.update(data, {
        where: { id }
      });

      if (updatedCount === 0) return res.status(404).json({ error: 'Staff member not found or no changes detected' });

      const updatedStaff = await StaffMemberModel.findByPk(id, {
        include: ['role']
      });

      return res.status(200).json(updatedStaff);
    } catch (error) {
      console.error('Error in updateRole:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteStaffMember(req, res) {
        try {
            const { id } = req.params;

            const staffMember = await StaffMemberModel.findByPk(id)
            if (!staffMember) {
              return res.status(404).json({ error: 'Staff member not found in this company' });
            }

            const staffMemberData = StaffMemberController.transformStaffMemberData(staffMember)

            await StaffMemberModel.destroy({
              where: { id },
              individualHooks: true
            })

            return res.status(200).json({
              message: 'Staff member deleted successfully',
              deletedStaffMember: staffMemberData
            })
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });   
        }
  }
}
