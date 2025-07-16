import z from 'zod';

export const offeredServiceSchema = z.object({
    id: z.string().uuid("Invalid UUID format"),
    serviceID: z.string().uuid("Invalid UUID format"),
    staffMemberID: z.string().uuid("Invalid UUID format"),
    customDescription: z.string().optional(),
    customPrice: z.number().positive("Custom price must be a positive number").optional(),
    customDuration: z.number().int().positive("Custom duration must be a positive integer").optional(),
})

export function validateOfferedService(object) {
    return offeredServiceSchema.safeParse(object)
}

export function validatePartialOfferedService(object) {
    return offeredServiceSchema.partial().safeParse(object)
}