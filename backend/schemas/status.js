import z from 'zod';

export const statusSchema = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])

export function validateStatus (object) {
    return statusSchema.safeParse(object)
}