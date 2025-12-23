import crypto from 'crypto';
import { PaymentModel, AppointmentModel, OfferedServiceModel, StatusModel } from '../models/sequelize/sequelize.js'

export class PaymentsController {
  static async addPayment(req, res) {
    try {
      const { amount } = req.body;
      const { appointmentId } = req.params;

      const appt = await AppointmentModel.findByPk(appointmentId, {
        include: {
          model: OfferedServiceModel,
          attributes: ['customPrice']
        }
      });

      if (!appt) return res.status(404).json({ error: 'Appointment not found' });

      const newPayment = await PaymentModel.create({
        id: crypto.randomUUID(),
        appointmentId,
        amount
      });

      const allPayments = await PaymentModel.findAll({
        where: { appointmentId }
      });

      const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
      const fullPrice = parseFloat(appt.offered_service.customPrice);

      if (totalPaid >= fullPrice) {
        const paidStatus = await StatusModel.findOne({ where: { name: 'PAID' } });
        if (paidStatus) {
          appt.statusId = paidStatus.id;
          await appt.save();
        }
      }

      return res.status(201).json(newPayment);
    } catch (error) {
      console.error('Error adding payment:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async removeLastPayment(req, res) {
    try {
      const { appointmentId } = req.params;

      const lastPayment = await PaymentModel.findOne({
        where: { appointmentId },
        order: [['paymentDate', 'DESC']]
      });

      if (!lastPayment) {
        return res.status(404).json({ error: 'No payments to delete' });
      }

      await lastPayment.destroy();
      return res.status(200).json({ message: 'Last payment deleted' });
    } catch (error) {
      console.error('Error deleting payment:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getPaymentsByAppointment(req, res) {
    try {
      const { appointmentId } = req.params;

      const payments = await PaymentModel.findAll({
        where: { appointmentId },
        order: [['paymentDate', 'DESC']]
      });

      if (payments.length === 0) {
        return res.status(404).json({ error: 'No payments found for this appointment' });
      }

      return res.status(200).json(payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } 
};
