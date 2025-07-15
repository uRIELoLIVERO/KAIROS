import { AppointmentModel } from '../models/appointment.js';

import { validateAppointment, validateParcialAppointment } from '../schemas/appointment.js';

export class AppointmentController {
    static async createAppointment(req, res) {
        try {
            const { error, data } = validateParcialAppointment(req.body);
            if (error) {
                return res.status(400).json({ error: error.message });
            }

            const newAppointment = await AppointmentModel.createAppointment(data);
            return res.status(201).json(newAppointment);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    // Get all appointments, optionally filtered by status
    static async getAllAppointments(req, res) {
        try {
            const { status } = req.query;
            const appointments = await AppointmentModel.getAllAppointments({ status });
            return res.status(200).json(appointments);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async getAppointmentById(req, res) {
        try {
            const id = req.params.id;
            const results = await AppointmentModel.getAppointmentById(id);
            results ? res.status(200).json(results) : res.status(404).json({ error: 'Appointment not found' });
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
            const appointments = await AppointmentModel.getAppointmentsByDay(date)

            if (appointments.length === 0) {
                return res.status(404).json({ error: `No appointments found for this date: ${date}` });
            }
            
            return res.status(200).json(appointments);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async getAppointmentsByWeek(req, res) {
        try {
            const { date } = req.query;
            const appointments = await AppointmentModel.getAppointmentsByWeek(date);
            
            if (appointments.length === 0) {
                return res.status(404).json({ error: `No appointments found for this week` });
            }

            return res.status(200).json(appointments);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async getAppointmentsByMonth(req, res) {
        try {
            const { date } = req.query;
            const appointments = await AppointmentModel.getAppointmentsByMonth(date);

            if (appointments.length === 0) {
                return res.status(404).json({ error: `No appointments found for this month` });
            }

            return res.status(200).json(appointments);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async getAppointmentsByYear(req, res) {
        try {
            const { date } = req.query;
            const appointments = await AppointmentModel.getAppointmentsByYear(date);

            if (appointments.length === 0) {
                return res.status(404).json({ error: `No appointments found for this year` });
            }
            
            return res.status(200).json(appointments);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async updateAppointment(req, res) {
        try {
            const id = req.params.id;
            const { error, data } = validateParcialAppointment(req.body);
            if (error) {
                return res.status(400).json({ error: error.message });
            }
            const updatedAppointment = await AppointmentModel.updateAppointment(id, data)
            return res.status(200).json(updatedAppointment)
            
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async changeAppointmentStatus(req, res) {
        try {
            const id = req.params.id
            const { status } = req.body;
            const appointment = await AppointmentModel.changeAppointmentStatus(id, status);
            appointment
                ? res.status(200).json(appointment)
                : res.status(404).json({ error: 'Appointment not found' });
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    static async deleteAppointment(req, res) {
        try {
            const id = req.params.id
            const deletedAppointment = await AppointmentModel.deleteAppointment(id);
            deletedAppointment
                ? res.status(200).json(deletedAppointment)
                : res.status(404).json({ error: 'The appointment does not exist' }); 
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
    
}