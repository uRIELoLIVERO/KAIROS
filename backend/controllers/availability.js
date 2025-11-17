import { validateAvailability, validatePartialAvailability } from '../schemas/availability.js';
import { AvailabilityModel, StaffMemberModel, AvailabilityDayModel, TimeSlotModel, sequelize, ProfessionalModel } from '../models/sequelize/sequelize.js'

export class AvailabilityController {

  static async createAvailability(req, res) {
    try {
      const validationResult = await validatePartialAvailability(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.message });
      }

      const { name, staffMemberId } = validationResult.data;

      const staffMember = await StaffMemberModel.findByPk(staffMemberId);
      if (!staffMember) {
        return res.status(404).json({ error: 'Staff member not found' });
      }

      // --- LÓGICA DE DUPLICADOS (MODELO B) ---
      if (staffMember.availabilityId) {
        return res.status(409).json({ error: 'Availability already exists for this staff member' });
      }

      const t = await sequelize.transaction();

      try {
        // --- LÓGICA DE CREACIÓN (MODELO B) ---
        // 1. Crea la disponibilidad
        const newAvailability = await AvailabilityModel.create({
          name: name, 
          staffMemberId: staffMember.id
        }, { transaction: t });

        // 2. CREAR LOS 7 DÍAS DE LA SEMANA AUTOMÁTICAMENTE
        const daysOfWeek = [
          { dayOfWeek: 'MONDAY', isEnabled: false },
          { dayOfWeek: 'TUESDAY', isEnabled: false },
          { dayOfWeek: 'WEDNESDAY', isEnabled: false },
          { dayOfWeek: 'THURSDAY', isEnabled: false },
          { dayOfWeek: 'FRIDAY', isEnabled: false },
          { dayOfWeek: 'SATURDAY', isEnabled: false },
          { dayOfWeek: 'SUNDAY', isEnabled: false }
        ];

        // Crear todos los días de la semana
        await Promise.all(
          daysOfWeek.map(day => 
            AvailabilityDayModel.create({
              ...day,
              availabilityId: newAvailability.id
            }, { transaction: t })
          )
        );

        // 3. Vincula la nueva disponibilidad al miembro del personal
        await StaffMemberModel.update(
          { availabilityId: newAvailability.id },
          { where: { id: staffMemberId }, transaction: t }
        );

        await t.commit();

        // 4. Devuelve la nueva disponibilidad CON LOS DÍAS INCLUIDOS
        const availabilityWithDays = await AvailabilityModel.findByPk(newAvailability.id, {
          include: [
            {
              association: 'availability_days',
              include: ['time_slots']
            }
          ]
        });

        return res.status(201).json(availabilityWithDays);

      } catch (error) {
        await t.rollback();
        throw error;
      }

    } catch (error) {
      console.error('Error in createAvailability:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // NUEVO MÉTODO PARA INICIALIZAR DÍAS EN AVAILABILITIES EXISTENTES
  static async initializeDays(req, res) {
    try {
      const { availabilityId } = req.params;

      const availability = await AvailabilityModel.findByPk(availabilityId);
      if (!availability) {
        return res.status(404).json({ error: 'Availability not found' });
      }

      // Verificar si ya existen días para esta availability
      const existingDays = await AvailabilityDayModel.findAll({
        where: { availabilityId }
      });

      if (existingDays.length > 0) {
        return res.status(409).json({ error: 'Days already exist for this availability' });
      }

      const t = await sequelize.transaction();

      try {
        // Crear los 7 días de la semana
        const daysOfWeek = [
          { dayOfWeek: 'MONDAY', isEnabled: false },
          { dayOfWeek: 'TUESDAY', isEnabled: false },
          { dayOfWeek: 'WEDNESDAY', isEnabled: false },
          { dayOfWeek: 'THURSDAY', isEnabled: false },
          { dayOfWeek: 'FRIDAY', isEnabled: false },
          { dayOfWeek: 'SATURDAY', isEnabled: false },
          { dayOfWeek: 'SUNDAY', isEnabled: false }
        ];

        await Promise.all(
          daysOfWeek.map(day => 
            AvailabilityDayModel.create({
              ...day,
              availabilityId: availabilityId
            }, { transaction: t })
          )
        );

        await t.commit();

        // Devolver los días creados
        const days = await AvailabilityDayModel.findAll({
          where: { availabilityId }
        });

        return res.status(201).json(days);

      } catch (error) {
        await t.rollback();
        throw error;
      }

    } catch (error) {
      console.error('Error in initializeDays:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAvailability(req, res) {
    try {
      const { staffMemberId } = req.params;
      
      // 1. Busca al miembro del personal
      const staffMember = await StaffMemberModel.findByPk(staffMemberId);
      
      if (!staffMember) {
        return res.status(404).json({ error: 'Staff member not found' });
      }

      // 2. Comprueba si tiene un ID de disponibilidad (Modelo B)
      if (!staffMember.availabilityId) {
        return res.status(200).json(null);
      }

      // 3. Si tiene ID, busca la disponibilidad usando ese ID
      const availability = await AvailabilityModel.findByPk(staffMember.availabilityId, {
        include: [
          {
            association: 'availability_days',
            include: ['time_slots']
          }
        ]
      });
      
      // 4. Devuelve la disponibilidad
      return res.status(200).json(availability);

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

  static async getAvailabilityByLoggedUser(req, res) {
    try {
        // 1. Obtener el profesional asociado al usuario
        const professional = await ProfessionalModel.findOne({
            where: { userId: req.user.id }
        });
        if (!professional) {
            return res.status(404).json({ error: 'Professional not found' });
        }

        // 2. Obtener los staff members del profesional
        const staffMembers = await StaffMemberModel.findAll({
            where: { professionalId: professional.id },
            attributes: ['id', 'availability_id'] 
        });

        // 3. Filtrar staff members que tienen availability_id y extraer los IDs
        const availabilityIds = staffMembers
            .map(sm => sm.availability_id)
            .filter(id => id !== null);

        if (availabilityIds.length === 0) {
            return res.status(200).json([]); // No hay disponibilidades
        }

        // 4. Obtener las disponibilidades con sus días y horarios
        const availabilities = await AvailabilityModel.findAll({
            where: { id: availabilityIds },
            include: [
                {
                    model: AvailabilityDayModel,
                    include: [
                        {
                            model: TimeSlotModel
                        }
                    ]
                }
            ]
        });

        // 5. Mapear el resultado para incluir el staffMemberId
        const result = availabilities.map(availability => {
            const staffMember = staffMembers.find(sm => sm.availability_id === availability.id);
            return {
                staffMemberId: staffMember.id,
                ...availability.toJSON()
            };
        });

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in getAvailabilityByLoggedUser:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
  }
}