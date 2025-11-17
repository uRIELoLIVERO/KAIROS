import { TimeSlotModel } from '../models/sequelize/sequelize.js';
import { validatePartialTimeSlot } from '../schemas/timeSlot.js';

export class TimeSlotController {

    static async createTimeSlot(req, res) {
        try {
            const resultTimeSlot = validatePartialTimeSlot(req.body);
            if (!resultTimeSlot.success) return res.status(400).json({ error: error.message });
            const newTimeSlot = await TimeSlotModel.create(resultTimeSlot.data);
            return res.status(201).json({ message: 'Time slot created successfully' }, newTimeSlot);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateTimeSlot(req, res) {
        try {
            const { id } = req.params;
            const resultTimeSlot = validatePartialTimeSlot(req.body);
            if (!resultTimeSlot.success) return res.status(400).json({ error: resultTimeSlot.error.message });

            await TimeSlotModel.update(resultTimeSlot.data, { where: { id } });
            const updatedTimeSlot = await TimeSlotModel.findByPk(id);
            return res.status(200).json(updatedTimeSlot);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

    }

    static async deleteTimeSlot(req, res) {
        try {
            const { id } = req.params;
            const timeSlot = await TimeSlotModel.findByPk(id)

            if(!timeSlot) {
                return res.status(404).json({ error: 'Time slot not found' })
            }

            await TimeSlotModel.destroy({
                where: {id},
                individualHooks: true
            })
            return res.status(200).json({ message: 'Time slot deleted successfully' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getTimeSlotById(req, res) {
        try {
            const {id} = req.params;
            const timeSlot = await TimeSlotModel.findByPk(id);
            return timeSlot
                ? res.status(200).json(timeSlot)
                : res.status(404).json({ error: 'Time slot not found' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getTimeSlotsByDayId(req, res) {
        try {
            const {dayId} = req.params;
            const timeSlots = await TimeSlotModel.findAll({ where: { availabilityDayId: dayId } });
            return res.status(200).json(timeSlots);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}