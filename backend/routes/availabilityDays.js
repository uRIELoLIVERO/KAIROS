import { Router } from "express";
import { AvailabilityDayController } from "../controllers/availabilityDay.js";
import { authenticate } from "../middlewares/authenticate.js";

export const avaylabilityDayRouter = Router()

avaylabilityDayRouter.use(authenticate)

avaylabilityDayRouter.get('/', AvailabilityDayController.getAllAvailabilityDay);
avaylabilityDayRouter.get('/:id', AvailabilityDayController.getAvailabilityDayById);
avaylabilityDayRouter.post('/', AvailabilityDayController.createAvailabilityDay);
avaylabilityDayRouter.put('/:id', AvailabilityDayController.updateAvailabilityDay);
avaylabilityDayRouter.delete('/:id', AvailabilityDayController.deleteAvailabilityDay);
avaylabilityDayRouter.get('/availability/:id', AvailabilityDayController.getAvailabilityDayByAvailabilityId);