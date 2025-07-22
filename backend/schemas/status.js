import z from 'zod';

export const statusEnum = z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']);

export const statusSchema = z.object({
    id: z.number().int().positive(), 
    name: statusEnum
});

export function validateStatus(object) {
    return statusSchema.safeParse(object);
}

export function validatePartialStatus(object) {
    return statusSchema.partial().safeParse(object)
}