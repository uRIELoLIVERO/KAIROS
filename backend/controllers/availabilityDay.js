import { AvailabilityDayModel } from '../models/sequelize/sequelize.js';
import { validateAvailabilityDay, validatePartialAvailabilityDay } from '../schemas/availabilityDay.js';


export class AvailabilityDayController {

    static async getAllAvailabilityDay(req, res) {
        try {
            const availabilityDays = await AvailabilityDayModel.findAll();
            return res.status(200).json(availabilityDays);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getAvailabilityDayById(req, res) {
        try {
            const { id } = req.params;
            const availabilityDay = await AvailabilityDayModel.findByPk(id);
            return availabilityDay
                ? res.status(200).json(availabilityDay)
                : res.status(404).json({ error: 'Availability day not found' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getAvailabilityDayByAvailabilityId(req, res) {
        try {
            const { id } = req.params;
            const availabilityDay = await AvailabilityDayModel.findAll({where : {availabilityId : id}});
            return availabilityDay
                ? res.status(200).json(availabilityDay)
                : res.status(404).json({ error: 'Availability day not found' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async createAvailabilityDay(req, res) {
        try {
            const result = validatePartialAvailabilityDay(req.body);
            if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
            
            const newAvailabilityDay = await AvailabilityDayModel.create(result.data);
            return res.status(201).json(newAvailabilityDay);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateAvailabilityDay(req, res) {
        try {
            const { id } = req.params;
            const result = validatePartialAvailabilityDay(req.body);
            if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

            const [affectedRows] = await AvailabilityDayModel.update(result.data, { where: { id } });
            if (affectedRows === 0) return res.status(404).json({ error: 'Availability day not found' });

            const updatedAvailabilityDay = await AvailabilityDayModel.findByPk(id);
            return res.status(200).json(updatedAvailabilityDay);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }


    static async deleteAvailabilityDay(req, res) {
        try {
            const { id } = req.params;
            const availabilityDay = await AvailabilityDayModel.findByPk(id);
            if (!availabilityDay) {
                return res.status(404).json({ error: 'Availability day not found' });
            }

            await AvailabilityDayModel.destroy({ where: { id } });
            return res.sendStatus(204);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}