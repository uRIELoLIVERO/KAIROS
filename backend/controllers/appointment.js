import { AppointmentModel, ClientModel, StatusModel, OfferedServiceModel, StaffMemberModel } from '../models/sequelize/sequelize.js';
import { validateAppointment, validatePartialAppointment } from '../schemas/appointment.js';
import { validateStatus, validatePartialStatus } from '../schemas/status.js';
import { validateClient } from '../schemas/client.js'
import { AppointmentService } from '../services/appointment.js';

export class AppointmentController {
    // Data formatter for outputs
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
            deletedAt: data.deleted_at || data.deletedAt
        };
        
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
            ...data,
            id: crypto.randomUUID(),
            statusId: 2,
            clientId: client.id,
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
            // need to implement jwt to get user id
        } catch (error) {
            console.error('Error:', error);
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