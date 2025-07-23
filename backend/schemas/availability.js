import { z } from 'zod';
import { availabilityDaySchema } from './availabilityDay.js';

export const availabilitySchema = z.object({
  availability_days: z.array(availabilityDaySchema).nonempty('At least one day is required')
});

export function validateAvailability(object) {
    return availabilitySchema.safeParse(object)
}

export function validatePartialAvailability(object) {
    return availabilitySchema.partial().safeParse(object)
}