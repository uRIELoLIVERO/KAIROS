import { ServiceModel } from '../models/sequelize/sequelize.js';
import { validateService, validatePartialService } from '../schemas/service.js';

export class ServiceController {
    static async createService(req, res) {
        try {
            const { error, data } = validateService(req.body);
            if (error) return res.status(400).json({ error: error.message });

            const newService = await ServiceModel.create(data);
            return res.status(201).json(newService);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getAllServices(req, res) {
        try {
            const services = await ServiceModel.findAll();
            return res.status(200).json(services);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getServiceById(req, res) {
        try {
            const { id } = req.params;
            const service = await ServiceModel.findByPk(id);
            return service
                ? res.status(200).json(service)
                : res.status(404).json({ error: 'Service not found' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateService(req, res) {
        try {
            const { id } = req.params;
            const { error, data } = validatePartialService(req.body);
            if (error) return res.status(400).json({ error: error.message });

            await ServiceModel.update(data, { where: { id } });
            const updatedService = await ServiceModel.findByPk(id);
            return res.status(200).json(updatedService);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async deleteService(req, res) {
        try {
            const { id } = req.params;
            const deleted = await ServiceModel.destroy({ where: { id } });
            return deleted
                ? res.status(200).json({ message: 'Service deleted successfully' })
                : res.status(404).json({ error: 'Service not found' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
