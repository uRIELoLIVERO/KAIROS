import { availabilityExceptionSchema, validatePartialAvailabilityException } from '../schemas/availabilityException.js';
import { AvailabilityExceptionModel, StaffMemberModel } from '../models/sequelize/sequelize.js'

export class AvailabilityExceptionController {
      static async createException(req, res) {
        try {
          const resultAvailabilityException = validatePartialAvailabilityException(req.body);
          if (!resultAvailabilityException.success) return res.status(400).json({ error: resultAvailabilityException.error.message });
    
          const exception = await AvailabilityExceptionModel.create({
            ...resultAvailabilityException.data
          });
    
          return res.status(201).json(exception);
        } catch (error) {
          console.error('Error in addAvailabilityException:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
      }
    
      static async deleteException(req, res) {
        try {
          const { staffMemberId, exceptionId } = req.params;
    
          const staff = await StaffMemberModel.findByPk(staffMemberId);
          if (!staff) return res.status(404).json({ error: 'Staff member not found' });
    
          const deletedCount = await AvailabilityExceptionModel.destroy({
            where: {
              id: exceptionId,
              staffMemberId: staffMemberId
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
      static async updateException(req, res) {
        try {
            const { id } = req.params;
            const result = validatePartialAvailabilityException(req.body);
            if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

            const [affectedRows] = await AvailabilityExceptionModel.update(result.data, { where: { id } });
            if (affectedRows === 0) return res.status(404).json({ error: 'Availability exception not found' });

            const updatedException = await AvailabilityExceptionModel.findByPk(id);
            return res.status(200).json(updatedException);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

  static async getExceptionById(req, res) {
    try {
      const { id } = req.params;
      const exception = await AvailabilityExceptionModel.findByPk(id);
      return exception
          ? res.status(200).json(exception)
          : res.status(404).json({ error: 'Availability exception not found' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  static async getAllExceptionByStaffMemberId(req, res) {
    try {
      const { staffId } = req.params;
      const exceptions = await AvailabilityExceptionModel.findAll({ where: { staffMemberId : staffId} });
      return exceptions
          ? res.status(200).json(exceptions)
          : res.status(404).json({ error: 'Availabilities exceptions not found' });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}