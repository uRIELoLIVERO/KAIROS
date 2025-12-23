import z from 'zod';

export const availabilityExceptionSchema = z.object({
    id: z.number().int().positive("ID must be a positive integer"),
    isAvailable: z.boolean(),
    reason: z.string().optional(),
    staffMemberId: z.string().uuid("Invalid UUID format"),
    startDatetime: z.string().datetime("Invalid datetime format, expected ISO 8601"),
    endDatetime: z.string().datetime("Invalid datetime format, expected ISO 8601")
})

export function validateAvailabilityException(object) {
    return availabilityExceptionSchema.safeParse(object)
}

export function validatePartialAvailabilityException(object) {
    return availabilityExceptionSchema.partial().safeParse(object)
}