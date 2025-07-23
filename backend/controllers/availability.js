import { validateAvailability, validatePartialAvailability } from '../schemas/availability.js';
import { AvailabilityModel, StaffMemberModel, AvailabilityDayModel, TimeSlotModel, sequelize } from '../models/sequelize/sequelize.js'

export class AvailabilityController {
  static async getAvailability(req, res) {
    try {
      const { staffMemberId } = req.params;

      const staff = await StaffMemberModel.findByPk(staffMemberId, {
        include: [
          {
            association: 'availability',
            include: [
              {
                association: 'availability_days',
                include: ['time_slots'] // <-- Esto debe estar definido correctamente
              }
            ]
          }
        ]
      });

      if (!staff) return res.status(404).json({ error: 'Staff member not found' });

      return res.status(200).json(staff.availability);
    } catch (error) {
      console.error('Error in getAvailability:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateAvailability(req, res) {
    const t = await sequelize.transaction();
    try {
      const { staffMemberId } = req.params;
      const { error, data } = validatePartialAvailability(req.body);
      console.log('Parsed data:', JSON.stringify(data, null, 2));
      if (error) return res.status(400).json({ error: error.message });

      const staff = await StaffMemberModel.findByPk(staffMemberId, { transaction: t });
      if (!staff) {
        await t.rollback();
        return res.status(404).json({ error: 'Staff member not found' });
      }

      const availabilityId = staff.availabilityId;
      if (!availabilityId) {
        await t.rollback();
        return res.status(400).json({ error: 'Staff member has no availability assigned' });
      }

      // Eliminar todos los time_slots relacionados a los días de disponibilidad
      const days = await AvailabilityDayModel.findAll({
        attributes: ['id'],
        where: { availabilityId },
        transaction: t
      });

      const dayIds = days.map(d => d.id);

      if (dayIds.length > 0) {
        await TimeSlotModel.destroy({
          where: { availabilityDayId: dayIds },
          transaction: t
        });

        await AvailabilityDayModel.destroy({
          where: { id: dayIds },
          transaction: t
        });
      }

      // Crear nuevos días y time_slots
      for (const day of data.availability_days || []) {
        const newDay = await AvailabilityDayModel.create({
          availabilityId,
          dayOfWeek: day.dayOfWeek
        }, { transaction: t });

        for (const slot of day.timeSlots || []) {
          await TimeSlotModel.create({
            availabilityDayId: newDay.id,
            startTime: slot.startTime,
            endTime: slot.endTime
          }, { transaction: t });
        }
      }

      await t.commit();

      // Recuperar disponibilidad actualizada con includes correctos
      const updated = await AvailabilityModel.findByPk(availabilityId, {
        include: [{
          model: AvailabilityDayModel,
          as: 'availability_days',
          include: [{
            model: TimeSlotModel,
            as: 'time_slots'
          }]
        }]
      });

      return res.status(200).json(updated);

    } catch (error) {
      await t.rollback();
      console.error('Error in updateAvailability:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}