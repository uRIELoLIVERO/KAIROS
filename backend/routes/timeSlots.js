import { Router } from 'express';
import { TimeSlotController } from '../controllers/timeSlot.js';
import { authenticate } from '../middlewares/authenticate.js';

export const timeSlotsRouter = Router()

timeSlotsRouter.use(authenticate)

timeSlotsRouter.post('/', TimeSlotController.createTimeSlot);
timeSlotsRouter.put('/:id', TimeSlotController.updateTimeSlot);
timeSlotsRouter.delete('/:id', TimeSlotController.deleteTimeSlot);
timeSlotsRouter.get('/:id', TimeSlotController.getTimeSlotById);
timeSlotsRouter.get('/day/:dayId', TimeSlotController.getTimeSlotsByDayId);