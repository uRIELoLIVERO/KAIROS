import crypto from 'crypto';

import data from '../bd.json' with { type: 'json' };

const appointments = data.appointment;


export class AppointmentModel {
    static async createAppointment(appointment) {
        const newAppointment = {
            id: crypto.randomUUID(),
            creationDateTime: new Date().toISOString(),
            status: 'PENDING',
            ...appointment,
        }
        appointments.push(newAppointment)
        return newAppointment;
    }

    static async getAllAppointments({status}) {
        if (status) {
            return appointments.filter(a => a.status.toLowerCase() === status.toLowerCase());
        }
        return appointments;
    }

    static async getAppointmentById(id) {
        return appointments.find(a => a.id === id);
    }

    static async getAppointmentsByLoggedUser(userId) {
        return appointments.filter(appointment => appointment.client.id === userId);
    }

    static async getAppointmentsByDay(date) {
        const targetDate = Temporal.PlainDate.from(date); // '2025-07-09'

        return appointments.filter(a => {
            const apptDateTime = Temporal.Instant.from(a.appoinmentDateTime); // ej: 2025-07-09T14:00:00Z
            const apptDate = apptDateTime.toZonedDateTimeISO('UTC').toPlainDate(); // extrae solo la fecha en UTC

            return apptDate.equals(targetDate);
        });
    }

    static async getAppointmentsByWeek(date) {
        
    const inputDate = Temporal.PlainDate.from(date); 

    const dayOfWeek = inputDate.dayOfWeek;

    const startOfWeek = inputDate.subtract({ days: dayOfWeek - 1 });

    const endOfWeek = inputDate.add({ days: 7 - dayOfWeek });

    return appointments.filter(a => {
        const apptDate = Temporal.Instant.from(a.appoinmentDateTime)
        .toZonedDateTimeISO('UTC')
        .toPlainDate();

        return Temporal.PlainDate.compare(apptDate, startOfWeek) >= 0 &&
            Temporal.PlainDate.compare(apptDate, endOfWeek) <= 0;
    });
    }

  // Obtener turnos por mes
  static async getAppointmentsByMonth(date) {
    const targetDate = Temporal.PlainDate.from(date);
    const year = targetDate.year;
    const month = targetDate.month;

    return appointments.filter(a => {
      const apptDate = Temporal.Instant.from(a.appoinmentDateTime)
        .toZonedDateTimeISO('UTC')
        .toPlainDate();

      return apptDate.year === year && apptDate.month === month;
    });
  }

  // Obtener turnos por año
  static async getAppointmentsByYear(date) {
    const targetDate = Temporal.PlainDate.from(date);
    const year = targetDate.year;

    return appointments.filter(a => {
      const apptDate = Temporal.Instant.from(a.appoinmentDateTime)
        .toZonedDateTimeISO('UTC')
        .toPlainDate();

      return apptDate.year === year;
    });
  }

    static async updateAppointment(id, updatedData) {
    const appointmentIndex = appointments.findIndex(appointment => appointment.id === id);
    if (appointmentIndex === -1) {
        throw new Error('Appointment not found');
    }

    const existing = appointments[appointmentIndex];

    const mergedClient = updatedData.client
        ? { ...existing.client, ...updatedData.client }
        : existing.client;

    const updatedAppointment = {
        ...existing,
        ...updatedData,
        client: mergedClient
    };

    appointments[appointmentIndex] = updatedAppointment;

    return updatedAppointment;
}


    static async changeAppointmentStatus(id, status) {
        const appointment = await this.getAppointmentById(id);
        if (!appointment) {
            throw new Error('Appointment not found');
        }
        appointment.status = status;
        return appointment;
    }

    static async deleteAppointment(id) {
        const appointmentIndex = appointments.findIndex(appointment => appointment.id === id);
        if (appointmentIndex === -1) {
            throw new Error('Appointment not found');
        }
        const deletedAppointment = appointments.splice(appointmentIndex, 1)[0];
        return deletedAppointment;
    }


}