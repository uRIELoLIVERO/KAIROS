import { Router } from 'express';
import { TimeSlotController } from '../controllers/timeSlot.js';
import { authenticate } from '../middlewares/authenticate.js';

export const timeSlotsRouter = Router()

timeSlotsRouter.get('/day/:dayId', TimeSlotController.getTimeSlotsByDayId);

timeSlotsRouter.use(authenticate)

timeSlotsRouter.get('/:id', TimeSlotController.getTimeSlotById);
timeSlotsRouter.post('/', TimeSlotController.createTimeSlot);
timeSlotsRouter.put('/:id', TimeSlotController.updateTimeSlot);
timeSlotsRouter.delete('/:id', TimeSlotController.deleteTimeSlot);