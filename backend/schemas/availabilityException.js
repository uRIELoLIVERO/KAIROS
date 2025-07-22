import z from 'zod';

import { timeSlotSchema } from './timeSlot.js';

export const availabilityExceptionSchema = z.object({
    day: z.string().date("Invalid date format"),
    isAvailable: z.boolean(),
    timeSlots: timeSlotSchema.array(),
    reason: z.string().optional()
})

export function validateAvailabilityException(object) {
    return availabilityExceptionSchema.safeParse(object)
}

export function validatePartialAvailabilityException(object) {
    return availabilityExceptionSchema.partial().safeParse(object)
}