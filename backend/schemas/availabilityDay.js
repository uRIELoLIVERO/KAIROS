import z from 'zod';
import { timeSlotSchema } from './timeSlot.js';

export const availabilityDaySchema = z.object({
    dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
    timeSlots: timeSlotSchema.array().nonempty("At least one time slot is required"),
})