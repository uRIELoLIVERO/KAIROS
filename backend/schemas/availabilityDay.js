import z from 'zod';

export const availabilityDaySchema = z.object({
    id: z.number().int().positive("ID must be a positive integer"),
    dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
    availabilityId: z.number().int().positive("Availability ID must be a positive integer"),
    isEnabled: z.boolean(),
})

export function validateAvailabilityDay(object) {
    return availabilityDaySchema.safeParse(object);
}

export function validatePartialAvailabilityDay(object) {
    return availabilityDaySchema.partial().safeParse(object);
}