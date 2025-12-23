import { AppointmentModel, ClientModel, StatusModel, OfferedServiceModel, StaffMemberModel, ProfessionalModel, UserModel, CompanyModel, ServiceModel } from '../models/sequelize/sequelize.js';
import { validateAppointment, validatePartialAppointment } from '../schemas/appointment.js';
import { validateStatus, validatePartialStatus } from '../schemas/status.js';
import { validateClient } from '../schemas/client.js'
import { AppointmentService } from '../services/appointment.js';
import crypto from 'crypto';
import { Op } from 'sequelize';

export class AppointmentController {
    // Data formatter for outputs
    // En AppointmentController.js - actualiza transformAppointmentData
    static transformAppointmentData(appointment) {
        const data = appointment.toJSON ? appointment.toJSON() : appointment;
        
        const transformedData = {
            id: data.id,
            appointmentDateTime: data.appointment_date_time || data.appointmentDateTime,
            offeredServiceId: data.offered_service_id || data.offeredServiceId,
            clientId: data.client_id || data.clientId,
            statusId: data.status_id || data.statusId,
            canceledAt: data.canceled_at || data.canceledAt,
            createdAt: data.created_at || data.createdAt,
            updatedAt: data.updated_at || data.updatedAt,
            deletedAt: data.deleted_at || data.deletedAt,
            
            // Incluir relaciones ANIDADAS como están en el log original
            OfferedService: data.OfferedService || data.offered_service,
            Client: data.Client || data.client,
            Status: data.Status || data.status
        };
        
        // Limpiar campos undefined
        Object.keys(transformedData).forEach(key => {
            if (transformedData[key] === undefined) {
                delete transformedData[key];
            }
        });
        
        return transformedData;
    }
    
    static async createAppointment(req, res) {
        try {
            const resultAppointment = validatePartialAppointment(req.body);
            if (!resultAppointment.success) {
                return res.status(400).json({ error: resultAppointment.error.message });
            }
            const data = resultAppointment.data;
            
            const resultClient = validateClient(req.body.client);
            if (!resultClient.success) {
                return res.status(400).json({ error: resultClient.error.message });
            }
            const dataClient = resultClient.data;
            
            const [client] = await ClientModel.findOrCreate({
                where: { phone_number: dataClient.phoneNumber },
                defaults: dataClient,
            });
            
            const newAppointment = await AppointmentModel.create({
                id: crypto.randomUUID(),
                appointmentDateTime: data.appointmentDateTime,
                offeredServiceId: data.offeredServiceId,
                statusId: 1,
                clientId: client.id
            });
            
            return res.status(201).json(AppointmentController.transformAppointmentData(newAppointment));
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    // Get all appointments, optionally filtered by status
    static async getAllAppointments(req, res) {
        try {
            const { status } = req.query;
            const where = status ? { statusId: status } : undefined;
            const appointments = await AppointmentModel.findAll({ 
                where,
                raw: false 
            });
            return res.status(200).json(appointments.map(a => AppointmentController.transformAppointmentData(a)));
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    // Get appointments by email and company (NEW METHOD)
    static async getAppointmentsByEmailAndCompany(req, res) {
        try {
            const { email, companyId, status } = req.query;
            
            if (!email || !companyId) {
                return res.status(400).json({ 
                    error: 'Email and companyId are required' 
                });
            }
            
            // Buscar clientes con el email proporcionado
            const clients = await ClientModel.findAll({
                where: {
                    email: {
                        [Op.like]: `%${email}%`
                    }
                }
            });
            
            if (clients.length === 0) {
                return res.status(200).json([]);
            }
            
            const clientIds = clients.map(client => client.id);
            
            // Construir condiciones de búsqueda
            const whereConditions = {
                clientId: clientIds
            };
            
            if (status && !isNaN(status)) {
                whereConditions.statusId = parseInt(status);
            }
            
            // Buscar appointments con joins necesarios
            const appointments = await AppointmentModel.findAll({
                where: whereConditions,
                include: [
                    {
                        model: OfferedServiceModel,
                        required: true,
                        include: [
                            {
                                model: ServiceModel,
                                attributes: ['id', 'name']
                            },
                            {
                                model: StaffMemberModel,
                                required: true,
                                where: { companyId },
                                include: [
                                    {
                                        model: ProfessionalModel,
                                        attributes: ['id', 'profilePicture'],
                                        include: [
                                            {
                                                model: UserModel,
                                                attributes: ['id', 'firstName', 'lastName', 'email']
                                            }
                                        ]
                                    },
                                    {
                                        model: CompanyModel,
                                        attributes: ['id', 'name', 'icon', 'location']
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: ClientModel,
                        attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
                    },
                    {
                        model: StatusModel,
                        attributes: ['id', 'name']
                    }
                ],
                order: [['appointment_date_time', 'ASC']]
            });
            
            
            // En AppointmentController.js - dentro de getAppointmentsByEmailAndCompany
            const transformedAppointments = appointments.map(appointment => {
                const data = appointment.toJSON ? appointment.toJSON() : appointment;
                
                // 1. NOMBRE REAL DEL SERVICIO (usar service.name, NO customDescription)
                const serviceName = data.offered_service?.service?.name || 
                'Servicio Programado'; // Fallback genérico
                
                // 2. NOMBRE DEL PROFESIONAL
                const staffName = data.offered_service?.staff_member?.professional?.user ?
                `${data.offered_service.staff_member.professional.user.firstName} ${data.offered_service.staff_member.professional.user.lastName}` :
                'Profesional';
                
                // 3. DURACIÓN
                const duration = data.offered_service?.customDuration || 30;
                
                // 4. FECHA Y HORA
                let date = '';
                let startTime = '';
                let endTime = '';
                
                if (data.appointmentDateTime) {
                    try {
                        const appointmentDate = new Date(data.appointmentDateTime);
                        
                        if (!isNaN(appointmentDate.getTime())) {
                            // Fecha (YYYY-MM-DD)
                            date = appointmentDate.toISOString().split('T')[0];
                            
                            // Hora de inicio (HH:MM) - usar hora local
                            const startHours = appointmentDate.getHours().toString().padStart(2, '0');
                            const startMinutes = appointmentDate.getMinutes().toString().padStart(2, '0');
                            startTime = `${startHours}:${startMinutes}`;
                            
                            // Calcular hora de fin (hora inicio + duración)
                            const endDate = new Date(appointmentDate);
                            endDate.setMinutes(endDate.getMinutes() + duration);
                            const endHours = endDate.getHours().toString().padStart(2, '0');
                            const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
                            endTime = `${endHours}:${endMinutes}`;
                        }
                    } catch (error) {
                        console.error('Error procesando fecha/hora:', error);
                    }
                }
                
                // 5. INFORMACIÓN DEL CLIENTE
                const clientEmail = data.client?.email;
                const clientName = data.client ? 
                `${data.client.firstName} ${data.client.lastName}` : '';
                
                // 6. ESTADO
                const statusName = data.status?.name || 'PENDING';
                
                // 7. INFORMACIÓN ADICIONAL ÚTIL
                const serviceDescription = data.offered_service?.customDescription;
                const companyName = data.offered_service?.staff_member?.company?.name || '';
                
                return {
                    id: data.id,
                    appointmentDateTime: data.appointmentDateTime,
                    // NOMBRES CORRECTOS
                    serviceName,  // Nombre REAL del servicio (service.name)
                    staffName,    // Nombre REAL del profesional
                    duration,
                    // FECHAS FORMATEADAS
                    date,
                    startTime,
                    endTime,
                    // INFORMACIÓN DEL CLIENTE
                    clientEmail,
                    clientName,
                    // ESTADO
                    status: statusName,
                    // INFORMACIÓN ADICIONAL
                    serviceDescription, // customDescription (por si acaso)
                    companyName,
                    // PARA DEBUGGING (opcional)
                    _rawServiceName: data.offered_service?.service?.name,
                    _rawCustomDescription: data.offered_service?.customDescription,
                    _rawProfessionalName: data.offered_service?.staff_member?.professional?.user ? 
                    `${data.offered_service.staff_member.professional.user.firstName} ${data.offered_service.staff_member.professional.user.lastName}` : null
                };
            });
            
            return res.status(200).json(transformedAppointments);
            
        } catch (error) {
            console.error('Error fetching appointments by email and company:', error);
            return res.status(500).json({ 
                error: 'Internal server error',
            });
        }
    }
    
    static async getAppointmentById(req, res) {
        try {
            const id = req.params.id;
            const results = await AppointmentModel.findByPk(id);
            results ? res.status(200).json(AppointmentController.transformAppointmentData(results)) : res.status(404).json({ error: 'Appointment not found' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async getAppointmentsByLoggedUser(req, res) {
        try {
            const professional = await ProfessionalModel.findOne({
                where: { userId: req.user.id }
            });
            if (!professional) return res.status(404).json({ error: 'Professional not found' });
            
            const staffMembers = await StaffMemberModel.findAll({
                where: { professionalId: professional.id }
            });
            
            const staffMemberIds = staffMembers.map(sm => sm.id);
            
            const offeredServices = await OfferedServiceModel.findAll({
                where: { staffMemberId: staffMemberIds }
            });
            
            const offeredServiceIds = offeredServices.map(os => os.id);
            
            const appointments = await AppointmentModel.findAll({
                where: { offeredServiceId: offeredServiceIds },
                include: [
                    {
                        model: OfferedServiceModel,
                        attributes: ['id', 'customDuration', 'customPrice'],
                        include: [
                            {
                                model: StaffMemberModel,
                                attributes: ['id', 'companyId', 'professionalId'],
                                include: [
                                    {
                                        model: ProfessionalModel,
                                        attributes: ['profilePicture'],
                                        include: [
                                            {
                                                model: UserModel,
                                                attributes: ['firstName', 'lastName']
                                            }
                                        ]
                                    },
                                    {
                                        model: CompanyModel,
                                        attributes: ['name', 'icon', 'location']
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: ClientModel
                    },
                    {
                        model: StatusModel
                    }
                ],
                order: [['appointmentDateTime', 'ASC']]
            });
            
            return res.status(200).json(appointments);
        } catch (error) {
            console.error('Error fetching appointments by logged user:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async getAppointmentsByDay(req, res) {
        try {
            const { date } = req.query;
            const appointments = await AppointmentService.getAppointmentsByDay(date)
            
            if (appointments.length === 0) {
                return res.status(404).json({ error: `No appointments found for this date: ${date}` });
            }
            
            return res.status(200).json(appointments.map( a => AppointmentController.transformAppointmentData(a)));
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async getAppointmentsByWeek(req, res) {
        try {
            const { date } = req.query;
            const appointments = await AppointmentService.getAppointmentsByWeek(date);
            
            if (appointments.length === 0) {
                return res.status(404).json({ error: 'No appointments found for this week' });
            }
            
            return res.status(200).json(appointments.map( a => AppointmentController.transformAppointmentData(a)));
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async getAppointmentsByMonth(req, res) {
        try {
            const { date } = req.query;
            const appointments = await AppointmentService.getAppointmentsByMonth(date);
            
            if (appointments.length === 0) {
                return res.status(404).json({ error: 'No appointments found for this month' });
            }
            
            return res.status(200).json(appointments.map( a => AppointmentController.transformAppointmentData(a)));
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async getAppointmentsByYear(req, res) {
        try {
            const { date } = req.query;
            const appointments = await AppointmentService.getAppointmentsByYear(date);
            
            if (appointments.length === 0) {
                return res.status(404).json({ error: 'No appointments found for this year' });
            }
            
            return res.status(200).json(appointments.map( a => AppointmentController.transformAppointmentData(a)));
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async getAppointmentsByStaffMember(req, res) {
        try {
            const { staffMemberId } = req.params;
            
            const appointments = await AppointmentModel.findAll({
                include: [
                    {
                        model: OfferedServiceModel,
                        required: true,
                        include: [
                            {
                                model: StaffMemberModel,
                                required: true,
                                where: { id: staffMemberId }
                            }
                        ]
                    }
                ],
                raw: false
            });
            
            return res
            .status(200)
            .json(appointments.map((a) => AppointmentController.transformAppointmentData(a)));
        } catch (error) {
            console.error('Error', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async updateAppointment(req, res) {
        try {
            const id = req.params.id;
            const { error, data } = validatePartialAppointment(req.body);
            if (error) {
                return res.status(400).json({ error: error.message });
            }
            await AppointmentModel.update(data, { where: { id } })
            const updatedAppointment = await AppointmentModel.findByPk(id);
            return res.status(200).json(AppointmentController.transformAppointmentData(updatedAppointment))
            
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async changeAppointmentStatus(req, res) {
        try {
            const id = req.params.id
            const { error, data } = validatePartialStatus(req.body);
            if (error) {
                return res.status(400).json({ error: error.message });
            }
            
            const status = await StatusModel.findOne({ 
                where: { name: data.name } 
            });
            
            if (!status) {
                return res.status(400).json({ error: 'Invalid status'})
            }
            
            await AppointmentModel.update(
                { statusId: status.id },
                { where: { id }}
            );
            
            const appointment = await AppointmentModel.findByPk(id);
            appointment
            ? res.status(200).json(AppointmentController.transformAppointmentData(appointment))
            : res.status(404).json({ error: 'Appointment not found' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }
    
    static async deleteAppointment(req, res) {
        try {
            const { id } = req.params;
            
            const appointment = await AppointmentModel.findByPk(id);
            
            if (!appointment) {
                return res.status(404).json({ error: 'The appointment does not exist' });
            }
            
            const appointmentData = AppointmentController.transformAppointmentData(appointment);
            
            await AppointmentModel.destroy({ 
                where: { id },
                individualHooks: true
            });
            
            return res.status(200).json({
                message: 'Appointment deleted successfully',
                deletedAppointment: appointmentData
            });
            
        } catch (error) {
            console.error('Error deleting appointment:', error);
            
            if (error.name === 'SequelizeDatabaseError') {
                return res.status(400).json({ error: 'Invalid appointment ID format' });
            }
            
            return res.status(500).json({ 
                error: 'Internal server error',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}