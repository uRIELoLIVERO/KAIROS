import { StaffMemberModel, AvailabilityModel, AvailabilityExceptionModel, AppointmentModel, CompanyModel, ProfessionalModel } from '../models/sequelize/sequelize.js';

import { validateAvailability, validatePartialAvailability } from '../schemas/availability.js';
import { validateAvailabilityException } from '../schemas/availabilityException.js';
import { validatePartialStaffMember } from '../schemas/staffMember.js';

export class StaffMemberController {
  static async transformStaffMemberData(staffMember) {


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
        where: { companyId },
        include: ['professional', 'role']
      });

      return res.status(200).json(staff);
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

      return res.status(200).json(appointments);
    } catch (error) {
      console.error('Error in getAppointments:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAvailability(req, res) {
    try {
      const { id } = req.params;

      const staff = await StaffMemberModel.findByPk(id, {
        include: [{ association: 'availability', include: ['availability_days', 'time_slots'] }]
      });

      if (!staff) return res.status(404).json({ error: 'Staff member not found' });

      return res.status(200).json(staff.availability);
    } catch (error) {
      console.error('Error in getAvailability:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateAvailability(req, res) {
    try {
      const { id } = req.params;
      const { error, data } = validatePartialAvailability(req.body);
      if (error) return res.status(400).json({ error: error.message });

      const staff = await StaffMemberModel.findByPk(id);
      if (!staff) return res.status(404).json({ error: 'Staff member not found' });

      await AvailabilityModel.update(data, {
        where: { id: staff.availabilityId }
      });

      const updated = await AvailabilityModel.findByPk(staff.availabilityId);

      return res.status(200).json(updated);
    } catch (error) {
      console.error('Error in updateAvailability:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async addAvailabilityException(req, res) {
    try {
      const { id } = req.params;
      const { error, data } = validateAvailabilityException(req.body);
      if (error) return res.status(400).json({ error: error.message });

      const staff = await StaffMemberModel.findByPk(id);
      if (!staff) return res.status(404).json({ error: 'Staff member not found' });

      const exception = await AvailabilityExceptionModel.create({
        ...data,
        staffMemberId: id
      });

      return res.status(201).json(exception);
    } catch (error) {
      console.error('Error in addAvailabilityException:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async deleteAvailabilityException(req, res) {
    try {
      const { id, exceptionId } = req.params;

      const staff = await StaffMemberModel.findByPk(id);
      if (!staff) return res.status(404).json({ error: 'Staff member not found' });

      const deletedCount = await AvailabilityExceptionModel.destroy({
        where: {
          id: exceptionId,
          staffMemberId: id
        }
      });

      if (deletedCount === 0) {
        return res.status(404).json({ error: 'Availability exception not found or does not belong to this staff member' });
      }

      return res.status(204).send();
    } catch (error) {
      console.error('Error in deleteAvailabilityException:', error);
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
