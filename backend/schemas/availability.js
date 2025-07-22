import z from 'zod';
import { availabilityDaySchema } from './availabilityDay.js';

export const availabilitySchema = z.object({
    days: availabilityDaySchema.array()
})

export function validateAvailability(object) {
    return availabilitySchema.safeParse(object)
}

export function validatePartialAvailability(object) {
    return availabilitySchema.partial().safeParse(object)
}