import z from 'zod';

export const availabilityExceptionSchema = z.object({
    day: z.string().date("Invalid date format"),
    isAvailable: z.boolean(),
    reason: z.string().optional()
})

export function validateAvailabilityException(object) {
    return availabilityExceptionSchema.safeParse(object)
}

export function validatePartialAvailabilityException(object) {
    return availabilityExceptionSchema.partial().safeParse(object)
}