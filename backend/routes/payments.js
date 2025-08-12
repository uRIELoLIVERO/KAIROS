import express from 'express';
import { PaymentsController } from '../controllers/payment.js';

export const paymentsRouter = express.Router();

paymentsRouter.get('/:appointmentId', PaymentsController.getPaymentsByAppointment);
paymentsRouter.post('/:appointmentId', PaymentsController.addPayment);
paymentsRouter.delete('/:appointmentId', PaymentsController.removeLastPayment);
