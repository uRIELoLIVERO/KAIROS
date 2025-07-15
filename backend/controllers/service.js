import { ServiceModel } from '../models/service.js'
import { validateService, validateParcialService } from '../schemas/service.js'

export class ServiceController {
    static async createService(req, res) {
        try {
            const {error, data} = validateParcialService(req.body);
            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const newService = await ServiceModel.createService(data);
            return res.status(201).json(newService);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async getAllServices(req, res) {
        try {
            const services = await ServiceModel.getAllServices();
            return res.status(200).json(services);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async getServiceByID(req, res) {
        try {
            const { id } = req.params
            const service = await ServiceModel.getServiceByID(id);
            !service ? 
                res.status(404).json({ error: 'Service not found' }) : 
                res.status(200).json(service);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async updateService(req, res) {
        try {
            const { id } = req.params;
            const { error, data } = validateParcialService(req.body);
            if (error) {
                return res.status(400).json({ error: error.message });
            }
            const updatedService = await ServiceModel.updateService(id, data);

            return res.status(200).json(updatedService)
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async deleteService(req, res) {
        try {
            const { id } = req.params;
            const deletedService = await ServiceModel.deleteService(id);
            if (!deletedService) {
                return res.status(404).json({ error: 'Service not found' });
            }
            return res.status(200).json({ message: 'Service deleted successfully' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}