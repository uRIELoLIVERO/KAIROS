import { availabilityExceptionSchema, validateAvailabilityException } from '../schemas/availabilityException.js';
import { AvailabilityExceptionModel, StaffMemberModel } from '../models/sequelize/sequelize.js'

export class AvailabilityExceptionController {
      static async addException(req, res) {
        try {
          const { staffMemberId } = req.params;
          const resultAvailabilityException = validateAvailabilityException(req.body);
          if (!resultAvailabilityException.success) return res.status(400).json({ error: resultAvailabilityException.error.message });
    
          const staff = await StaffMemberModel.findByPk(staffMemberId);
          if (!staff) return res.status(404).json({ error: 'Staff member not found' });
    
          const exception = await AvailabilityExceptionModel.create({
            ...resultAvailabilityException.data,
            staffMemberId: staffMemberId
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
    
}