import { OfferedServiceModel, ServiceModel, ProfessionalModel, StaffMemberModel, CompanyModel, UserModel } from '../models/sequelize/sequelize.js'
import { validateOfferedService, validatePartialOfferedService } from '../schemas/offeredService.js'
import { Op } from 'sequelize';
import crypto from 'crypto';

export class OfferedServiceController {
    static transformOfferedServiceData(offeredService) {
        const data = offeredService.toJSON ? offeredService.toJSON() : offeredService;
        
        // Extraer datos de manera más robusta
        const staffMember = data.staff_member || data.StaffMember || {};
        const serviceData = data.service || data.Service || data.ServiceModel || {};
        const companyData = serviceData.company || serviceData.Company || {};
        
        // Extraer datos del profesional y usuario
        let userData = {};
        let professionalData = {};
        let staffName = 'Staff no asignado';
        
        // Verificar múltiples estructuras posibles
        if (staffMember.professional && staffMember.professional.user) {
            userData = staffMember.professional.user;
            professionalData = staffMember.professional;
        } else if (staffMember.Professional && staffMember.Professional.User) {
            userData = staffMember.Professional.User;
            professionalData = staffMember.Professional;
        } else if (staffMember.Professional && staffMember.Professional.user) {
            userData = staffMember.Professional.user;
            professionalData = staffMember.Professional;
        }
        
        // Obtener nombre del staff
        if (userData.firstName && userData.lastName) {
            staffName = `${userData.firstName} ${userData.lastName}`;
        } else if (userData.firstName) {
            staffName = userData.firstName;
        } else if (userData.first_name && userData.last_name) {
            staffName = `${userData.first_name} ${userData.last_name}`;
        } else if (userData.first_name) {
            staffName = userData.first_name;
        }
        
        const staffAvatar = professionalData?.profilePicture || professionalData?.profile_picture || null;
        
        // Obtener nombre de la empresa - verificar múltiples estructuras
        let companyName = "Empresa sin nombre";
        let companyId = null;
        
        if (companyData.name) {
            companyName = companyData.name;
            companyId = companyData.id;
        } else if (serviceData.companyName) {
            companyName = serviceData.companyName;
        } else if (serviceData.company_name) {
            companyName = serviceData.company_name;
        }
        
        if (serviceData.companyId) {
            companyId = serviceData.companyId;
        } else if (serviceData.company_id) {
            companyId = serviceData.company_id;
        }
        
        const transformedData = {
            id: data.id,
            offeredServiceId: data.id,
            staffMemberId: data.staffMemberId || data.staff_member_id,
            serviceId: data.serviceId || data.service_id,
            companyId: companyId,

            customDescription: data.customDescription || data.custom_description,
            customDuration: data.customDuration || data.custom_duration,
            customPrice: data.customPrice || data.custom_price,
            customBuffer: data.customBuffer || data.custom_buffer,

            // --- SERVICE INFO ---
            serviceName: serviceData.name || "Servicio sin nombre",
            serviceDescription: serviceData.description,
            serviceSuggestedDuration: serviceData.suggestedDuration || serviceData.suggested_duration,
            serviceSuggestedPrice: serviceData.suggestedPrice || serviceData.suggested_price,
            service: { // Mantener la estructura completa del servicio
                id: serviceData.id,
                name: serviceData.name,
                description: serviceData.description,
                suggestedDuration: serviceData.suggestedDuration || serviceData.suggested_duration,
                suggestedPrice: serviceData.suggestedPrice || serviceData.suggested_price,
                companyId: companyId,
                company: {
                    id: companyId,
                    name: companyName
                }
            },

            // --- COMPANY INFO ---
            companyName: companyName,

            // --- UI-FRIENDLY INFO ---
            name: serviceData.name || "Servicio sin nombre",
            description: data.customDescription || data.custom_description || serviceData.description,
            duration: data.customDuration || data.custom_duration || serviceData.suggestedDuration,
            price: data.customPrice || data.custom_price || serviceData.suggestedPrice,

            staffName: staffName,
            staffAvatar: staffAvatar,

            createdAt: data.createdAt || data.created_at,
            updatedAt: data.updatedAt || data.updated_at,
        };

        // Eliminar campos undefined/null
        Object.keys(transformedData).forEach(key => {
            if (transformedData[key] === undefined) {
                transformedData[key] = null;
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

            const newOfferedService = await OfferedServiceModel.create(data, {
                include: [ServiceModel, {
                    model: StaffMemberModel,
                    include: [{
                        model: ProfessionalModel,
                        include: [UserModel]
                    }]
                }]
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
                include: [
                    ServiceModel,
                    {
                        model: StaffMemberModel,
                        include: [{
                            model: ProfessionalModel,
                            include: [UserModel]
                        }]
                    }
                ],
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
            
            const updatedOfferedService = await OfferedServiceModel.findByPk(id, {
                include: [
                    ServiceModel,
                    {
                        model: StaffMemberModel,
                        include: [{
                            model: ProfessionalModel,
                            include: [UserModel]
                        }]
                    }
                ]
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
                include: [
                    ServiceModel,
                    {
                        model: StaffMemberModel,
                        include: [{
                            model: ProfessionalModel,
                            include: [UserModel]
                        }]
                    }
                ]
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
            const professional = await ProfessionalModel.findOne({
                where: { userId: req.user.id }
            });
            if (!professional) {
                return res.status(404).json({ error: 'Professional not found' });
            }
            
            const staffMembers = await StaffMemberModel.findAll({
                where: { professionalId: professional.id }
            });
            
            if (staffMembers.length === 0) {
                return res.status(404).json({ error: 'No staff members found' });
            }

            const offeredServices = await OfferedServiceModel.findAll({
                where: { staffMemberId: { [Op.in]: staffMembers.map(sm => sm.id) } },
                include: [
                    {
                        model: ServiceModel,
                        as: 'service',
                        include: [
                            {
                                model: CompanyModel,
                                as: 'company',
                                attributes: ['id', 'name']
                            }
                        ]
                    },
                    {
                        model: StaffMemberModel,
                        include: [{
                            model: ProfessionalModel,
                            include: [UserModel]
                        }]
                    }
                ],
                raw: false
            });
            
            if (offeredServices.length === 0) {
                return res.status(404).json({ error: 'No offered services found for this professional' });
            }
            
            const transformedServices = offeredServices.map(service => 
                OfferedServiceController.transformOfferedServiceData(service)
            );
            
            return res.status(200).json(transformedServices);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async getOfferedServiceById(req, res) {
        try {
            const { id } = req.params;
            
            const offeredService = await OfferedServiceModel.findByPk(id, {
                include: [
                    {
                        model: ServiceModel,
                        attributes: ['id', 'name', 'description', 'suggestedPrice', 'suggestedDuration']
                    },
                    {
                        model: StaffMemberModel,
                        attributes: ['id'],
                        include: [{
                            model: ProfessionalModel,
                            attributes: ['id', 'profilePicture'],
                            include: [{
                                model: UserModel,
                                attributes: ['id', 'firstName', 'lastName']
                            }]
                        }]
                    }
                ],
                attributes: [
                    'id', 
                    'customPrice', 
                    'customDuration', 
                    'customDescription',
                    'serviceId',
                    'staffMemberId'
                ]
            });
            
            if (!offeredService) {
                return res.status(404).json({ 
                    message: 'Servicio no encontrado',
                    data: null 
                });
            }
            
            const formattedService = OfferedServiceController.transformOfferedServiceData(offeredService);
            
            res.status(200).json(formattedService);
            
        } catch (error) {
            console.error('Error en getOfferedServiceById:', error);
            res.status(500).json({ 
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    static async getAllOfferedServicesByCompany(req, res) {
        try {
            const { companyId } = req.params;

            if (!companyId) {
                return res.status(400).json({ 
                    message: 'ID de empresa inválido' 
                });
            }
        
            const offeredServices = await OfferedServiceModel.findAll({
                include: [
                    {
                        model: ServiceModel,
                        where: { companyId: companyId },
                        required: true,
                        attributes: ['id', 'name', 'description', 'suggestedPrice', 'suggestedDuration']
                    },
                    {
                        model: StaffMemberModel,
                        attributes: ['id'],
                        include: [{
                            model: ProfessionalModel,
                            attributes: ['id', 'profilePicture'],
                            include: [{
                                model: UserModel,
                                attributes: ['id', 'firstName', 'lastName']
                            }]
                        }]
                    }
                ],
                attributes: [
                    'id', 
                    'customPrice', 
                    'customDuration', 
                    'customDescription',
                    'serviceId',
                    'staffMemberId'
                ]
            });
            
            if (!offeredServices || offeredServices.length === 0) {
                return res.status(404).json({ 
                    message: 'No se encontraron servicios para esta empresa',
                    data: [] 
                });
            }
            
            const formattedServices = offeredServices.map(service => 
                OfferedServiceController.transformOfferedServiceData(service)
            );
            
            res.status(200).json(formattedServices);
            
        } catch (error) {
            console.error('Error en getOfferedServicesByCompany:', error);
            res.status(500).json({ 
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    static async getOfferedServiceById(req, res) {
        try {
            const { id } = req.params;
            
            const offeredService = await OfferedServiceModel.findByPk(id, {
                include: [
                    ServiceModel,
                    {
                        model: StaffMemberModel,
                        attributes: ['id'],
                        include: [{
                            model: ProfessionalModel,
                            attributes: ['id', 'profilePicture'],
                            include: [{
                                model: UserModel,
                                attributes: ['id', 'firstName', 'lastName']
                            }]
                        }]
                    }
                ]
            });
            
            if (!offeredService) {
                return res.status(404).json({ 
                    message: 'Servicio no encontrado',
                    data: null 
                });
            }
            
            const formattedService = OfferedServiceController.transformOfferedServiceData(offeredService);
            
            res.status(200).json(formattedService);
            
        } catch (error) {
            console.error('Error en getOfferedServiceById:', error);
            res.status(500).json({ 
                message: 'Error interno del servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}