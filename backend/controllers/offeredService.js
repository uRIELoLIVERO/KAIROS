import { OfferedServiceModel, ServiceModel, ProfessionalModel, StaffMemberModel, CompanyModel } from '../models/sequelize/sequelize.js'
import { validateOfferedService, validatePartialOfferedService } from '../schemas/offeredService.js'
import { Op } from 'sequelize';
export class OfferedServiceController {
    // Data formatter for outputs
    static transformOfferedServiceData(offeredService) {
        const data = offeredService.toJSON ? offeredService.toJSON() : offeredService;
        
        const transformedData = {
            id: data.id,
            staffMemberId: data.staffMember_id || data.staffMemberId,
            serviceId: data.service_id || data.serviceId,
            customName: data.custom_name || data.customName,
            customDescription: data.custom_description || data.customDescription,
            customDuration: data.custom_duration || data.customDuration,
            customPrice: data.custom_price || data.customPrice,
            customBuffer: data.custom_buffer || data.customBuffer,
            suggestedName: data.service?.name || data.suggestedName,
            suggestedDescription: data.service?.description || data.suggestedDescription,
            suggestedDuration: data.service?.duration || data.suggestedDuration,
            suggestedPrice: data.service?.price || data.suggestedPrice,
            suggestedBuffer: data.service?.buffer || data.suggestedBuffer,
            createdAt: data.created_at || data.createdAt,
            updatedAt: data.updated_at || data.updatedAt,
            deletedAt: data.deleted_at || data.deletedAt
        };
        
        transformedData.name = transformedData.customName || transformedData.suggestedName;
        transformedData.description = transformedData.customDescription || transformedData.suggestedDescription;
        transformedData.duration = transformedData.customDuration || transformedData.suggestedDuration;
        transformedData.price = transformedData.customPrice || transformedData.suggestedPrice;
        
        Object.keys(transformedData).forEach(key => {
            if (transformedData[key] === undefined) {
                delete transformedData[key];
            }
        });
        
        return transformedData;
    }

    static async createOfferedService(req, res) {
        try {
            const result = validatePartialOfferedService(req.body);
            if (!result.success) {
                return res.status(400).json({ error: result.error.message });
            }
            
            const data = {
                ...result.data,
                id: crypto.randomUUID()
            };

            // Include the related service to get suggested values
            const newOfferedService = await OfferedServiceModel.create(data, {
                include: [ServiceModel]
            });

            return res.status(201).json(
                OfferedServiceController.transformOfferedServiceData(newOfferedService)
            );
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getOfferedServicesByProfessional(req, res) {
        try {
            const { staffMemberId } = req.params;
            
            const offeredServices = await OfferedServiceModel.findAll({
                where: { staffMemberId: staffMemberId },
                include: [ServiceModel], // Include service to get suggested values
                raw: false
            });

            if (offeredServices.length === 0) {
                return res.status(404).json({ error: 'No offered services found for this staffMember' });
            }
            
            return res.status(200).json(
                offeredServices.map(os => 
                    OfferedServiceController.transformOfferedServiceData(os)
                )
            );
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async updateOfferedService(req, res) {
        try {
            const { id } = req.params;
            
            const result = validatePartialOfferedService(req.body);
            if (!result.success) {
                return res.status(400).json({ error: result.error.message });
            }
            const data = result.data;

            await OfferedServiceModel.update(data, { 
                where: { id } 
            });
            
            // Get the updated offered service with its related service
            const updatedOfferedService = await OfferedServiceModel.findByPk(id, {
                include: [ServiceModel]
            });

            if (!updatedOfferedService) {
                return res.status(404).json({ error: 'Offered service not found' });
            }

            return res.status(200).json(
                OfferedServiceController.transformOfferedServiceData(updatedOfferedService)
            );
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async deleteOfferedService(req, res) {
        try {
            const { id } = req.params;
            
            const offeredService = await OfferedServiceModel.findByPk(id, {
                include: [ServiceModel]
            });
            
            if (!offeredService) {
                return res.status(404).json({ error: 'The offered service does not exist' });
            }

            const offeredServiceData = OfferedServiceController.transformOfferedServiceData(offeredService);
            
            await OfferedServiceModel.destroy({ 
                where: { id },
                individualHooks: true
            });

            return res.status(200).json({
                message: 'Offered service deleted successfully',
                deletedOfferedService: offeredServiceData
            });
        } catch (error) {
            console.error('Error deleting offered service:', error);
            
            if (error.name === 'SequelizeDatabaseError') {
                return res.status(400).json({ error: 'Invalid offered service ID format' });
            }
            
            return res.status(500).json({ 
                error: 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    static async getMyOfferedServices(req, res) {
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
                where: { professionalId: professional.id }
            });
            
            if (staffMembers.length === 0) {
                return res.status(404).json({ error: 'No staff members found' });
            }

            // 3. Obtener los offeredServices de los staffMembers
            const offeredServices = await OfferedServiceModel.findAll({
                where: { staffMemberId: { [Op.in]: staffMembers.map(sm => sm.id) } },
                include: [
                    {
                        model: ServiceModel,
                        include: [
                            {
                                model: CompanyModel,
                                attributes: ['id', 'name']
                            }
                        ]
                    }
                ],
                raw: false
            });
            
            if (offeredServices.length === 0) {
                return res.status(404).json({ error: 'No offered services found for this professional' });
            }
            
            return res.status(200).json(offeredServices);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}