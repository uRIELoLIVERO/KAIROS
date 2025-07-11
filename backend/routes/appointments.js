import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.js';

export const appointmentsRouter = Router()

// Create a new appointment
appointmentsRouter.post('/', AppointmentController.createAppointment);

// Get all appointments
appointmentsRouter.get('/', AppointmentController.getAllAppointments);

// Get appointments by day
appointmentsRouter.get('/day', AppointmentController.getAppointmentsByDay);

// Get appointments by loged user
appointmentsRouter.get('/me', AppointmentController.getAppointmentsByLoggedUser);

// Get appointments by week
appointmentsRouter.get('/week', AppointmentController.getAppointmentsByWeek);

// Get appointments by month
appointmentsRouter.get('/month', AppointmentController.getAppointmentsByMonth);

// Get appointments by year
appointmentsRouter.get('/year', AppointmentController.getAppointmentsByYear);

// Get specific appointment by ID
appointmentsRouter.get('/:id', AppointmentController.getAppointmentById);

// update an existing appointment by ID
appointmentsRouter.put('/:id', AppointmentController.updateAppointment)

// change appointment status
appointmentsRouter.patch('/:id/status', AppointmentController.changeAppointmentStatus);

// Delete an appointment by ID
appointmentsRouter.delete('/:id', AppointmentController.deleteAppointment);
