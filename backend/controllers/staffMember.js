import { StaffMemberModel, AppointmentModel, CompanyModel, ProfessionalModel } from '../models/sequelize/sequelize.js';

import { validatePartialStaffMember } from '../schemas/staffMember.js';
import { AppointmentController } from './appointment.js';

export class StaffMemberController {
  static async transformStaffMemberData(staffMember) {
    const data = staffMember.toJSON ? staffMember.toJSON() : staffMember;

    const transformedData = {
      id: data.id,
      companyId: data.company_id || data.companyId,
      professionalId: data.professional_id || data.professionalId,
      role: data.role,
      availability: data.availability,
      availabilityException: data.availability_exception || data.availabilityException,
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
      const { id, professionalID } = req.params;
    
      // Validación básica del formato
      if (!isValidUUID(id) || !isValidUUID(professionalID)) {
      return res.status(400).json({ error: "Invalid IDs" });
      }
    
      const resultRole = validateRole(req.body)
      if (!resultRole) {
        return res.status(400).json({ error: resultRole.error.message })
      }
    
      // Buscar empresa y profesional
    
      const company = await CompanyModel.getCompanyByID(id);
      const professional = await ProfessionalModel.getProfessionalByID(professionalID);
    
      if (!company || !professional) {
      return res.status(404).json({ error: "Company or professional not found" });
      }
    
      // Si se permiten roles personalizados desde el body (opcional)
      const staffMember = await StaffMemberModel.create({
          id: crypto.randomUUID(),
          companyId: id,
          professionalId: professionalID, 
          role: resultRole,
          availability: company.availability,
          availabilityException: company.availabilityException,
      });
    
      const staffMemberData = StaffMemberController.transformStaffMemberData(staffMember)
    
      return res.status(201).json({ message: "Professional added to company", staffMemberData });
    
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
  }  

  static async deleteStaffMember(req, res) {
    
  }

  static async getAllByCompany(req, res) {
    try {
      const { companyId } = req.params;

      const staff = await StaffMemberModel.findAll({
        where: { companyId }
      });

      return res.status(200).json((staff.map(s => StaffMemberController.transformStaffMemberData(s))));
    } catch (error) {
      console.error('Error in getAllByCompany:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAppointments(req, res) {
    try {
      const { id } = req.params;

      const appointments = await AppointmentModel.findAll({
        where: { staffMemberId: id },
        include: ['offeredService', 'client']
      });

      return res.status(200).json(AppointmentController.transformAppointmentData(appointments));
    } catch (error) {
      console.error('Error in getAppointments:', error);
      return res.status(500).json({ error: 'Internal server error' });
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
}
