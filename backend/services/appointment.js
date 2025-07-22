import { AppointmentModel } from '../models/sequelize/sequelize.js';
import { Op } from 'sequelize';

export class AppointmentService {
  static async getAppointmentsByDay(dateString) {
    try {
      // Validar y normalizar la fecha de entrada
      const date = Temporal.PlainDate.from(dateString);
      const start = date.toZonedDateTime('UTC').toInstant().toString();
      const end = date.add({ days: 1 }).toZonedDateTime('UTC').toInstant().toString();

      return await AppointmentModel.findAll({
        where: {
          appointment_date_time: {
            [Op.gte]: start,
            [Op.lt]: end
          },
          canceledAt: null
        }
      });
    } catch (error) {
      console.error('Error en getAppointmentsByDay:', error);
      throw new Error('Invalid date format or processing error');
    }
  }

  static async getAppointmentsByWeek(dateString) {
    try {
      const date = Temporal.PlainDate.from(dateString);
      const startOfWeek = date.subtract({ days: date.dayOfWeek - 1 });
      const start = startOfWeek.toZonedDateTime('UTC').toInstant().toString();
      const end = startOfWeek.add({ days: 7 }).toZonedDateTime('UTC').toInstant().toString();

      return await AppointmentModel.findAll({
        where: {
          appointment_date_time: {
            [Op.gte]: start,
            [Op.lt]: end
          },
          canceledAt: null
        }
      });
    } catch (error) {
      console.error('Error en getAppointmentsByWeek:', error);
      throw new Error('Invalid date format or processing error');
    }
  }

  static async getAppointmentsByMonth(dateString) {
    try {
      const date = Temporal.PlainDate.from(dateString);
      const startOfMonth = date.with({ day: 1 });
      const start = startOfMonth.toZonedDateTime('UTC').toInstant().toString();
      const end = startOfMonth.add({ months: 1 }).toZonedDateTime('UTC').toInstant().toString();

      return await AppointmentModel.findAll({
        where: {
          appointment_date_time: {
            [Op.gte]: start,
            [Op.lt]: end
          },
          canceledAt: null
        }
      });
    } catch (error) {
      console.error('Error en getAppointmentsByMonth:', error);
      throw new Error('Invalid date format or processing error');
    }
  }

  static async getAppointmentsByYear(dateString) {
    try {
      const date = Temporal.PlainDate.from(dateString);
      const startOfYear = date.with({ month: 1, day: 1 });
      const start = startOfYear.toZonedDateTime('UTC').toInstant().toString();
      const end = startOfYear.add({ years: 1 }).toZonedDateTime('UTC').toInstant().toString();

      return await AppointmentModel.findAll({
        where: {
          appointment_date_time: {
            [Op.gte]: start,
            [Op.lt]: end
          },
          canceledAt: null
        }
      });
    } catch (error) {
      console.error('Error en getAppointmentsByYear:', error);
      throw new Error('Invalid date format or processing error');
    }
  }
}