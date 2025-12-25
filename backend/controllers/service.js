import company from '../models/sequelize/company.js';
import { ServiceModel } from '../models/sequelize/sequelize.js';
import { validateService, validatePartialService } from '../schemas/service.js';
import crypto from 'crypto';

export class ServiceController {
    // Data formatter for outputs
    static transformServiceData(service) {
        const data = service.toJSON ? service.toJSON() : service;
        
        const transformedData = {
            id: data.id,
            name: data.name,
            description: data.description,
            suggestedPrice: data.suggested_price || data.suggestedPrice,
            suggestedDuration: data.suggested_duration || data.suggestedDuration,
            suggestedBuffer: data.suggested_buffer || data.suggestedBuffer,
            companyId: data.company_id || data.companiId,
            createdAt: data.created_at || data.createdAt,
            updatedAt: data.updated_at || data.updatedAt,
            deletedAt: data.deleted_at || data.deletedAt
        };
        
        Object.keys(transformedData).forEach(key => {
            if (transformedData[key] === undefined) {
                delete transformedData[key];
            }
        });
        
        return transformedData;
    }

    static async createService(req, res) {
        try {
            const resultService = validatePartialService(req.body);
            if (!resultService.success) return res.status(400).json({ error: resultService.error.message });

            const newService = await ServiceModel.create({
                ...resultService.data,
                id: crypto.randomUUID()
            });

            return res.status(201).json(ServiceController.transformServiceData(newService));
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getAllServices(req, res) {
        try {
            const services = await ServiceModel.findAll();
            return res.status(200).json(services.map( s => ServiceController.transformServiceData(s)));
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
                ? res.status(200).json(ServiceController.transformServiceData(service))
                : res.status(404).json({ error: 'Service not found' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateService(req, res) {
        try {
            const { id } = req.params;
            const resultService = validatePartialService(req.body);
            if (!resultService.success) return res.status(400).json({ error: resultService.error.message });

            await ServiceModel.update(resultService.data, { where: { id } });
            const updatedService = await ServiceModel.findByPk(id);
            return res.status(200).json(ServiceController.transformServiceData(updatedService));
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async deleteService(req, res) {
        try {
            const { id } = req.params;
            const service = await ServiceModel.findByPk(id)

            if(!service) {
                return res.status(404).json({ error: 'Service not found'})
            }

            const serviceData = ServiceController.transformServiceData(service);
            
            await ServiceModel.destroy({ 
                where: { id },
                individualHooks: true
            });

            return res.status(200).json({
                message: 'Service deleted successfully',
                deletedService: serviceData
            });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
