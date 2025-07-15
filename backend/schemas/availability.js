import z from 'zod';
import { availabilityDaySchema } from './availabilityDay.js';

export const availabilitySchema = z.object({
    days: availabilityDaySchema.array()
})